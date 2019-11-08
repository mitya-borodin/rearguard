import chalk from "chalk";
import * as path from "path";
import * as fs from "fs";
import { watch } from "chokidar";
import { getSortedListOfDependencies } from "./getSortedListOfDependencies";
import { getGlobalNodeModulePath } from "../../helpers/dependencyPaths";
import { REARGUARD_DEV_CONFIG_FILE_NAME } from "../../const";
import { RearguardDevConfig } from "../../configs/RearguardDevConfig";
import { events, pubSub } from "../../helpers/pubSub";
import { deleteExternalBundles } from "./deleteExternalBundles";
import { copyGlobalLinkedModules } from "./copyGlobalLinkedModules";
import { copyBundlesToProject } from "./copyBundlesToProject";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { processQueue } from "../../helpers/processQueue";
import { buildOutdatedDependency } from "./build/buildOutdatedDependency";

let inProgress = false;

let watcher: fs.FSWatcher | undefined;

export const watchLinkedModules = async (CWD: string): Promise<void> => {
  const shutdown = (): void => {
    if (watcher) {
      console.log(chalk.bold.yellow(`[ CLOSE WATCHER FOR MODULES OBSERVATION ]`));
      console.log("");

      watcher.close();
      watcher = undefined;
    }
  };

  shutdown();

  process.on("SIGINT", shutdown);
  process.on("exit", shutdown);
  process.on("uncaughtException", shutdown);
  process.on("unhandledRejection", shutdown);

  const rearguardConfig = new RearguardConfig(CWD);
  const isBrowser = rearguardConfig.isBrowser();
  const isIsomorphic = rearguardConfig.isIsomorphic();
  const name = rearguardConfig.getName();
  const dependencies = await getSortedListOfDependencies(CWD);
  const chokidarOptions = {
    cwd: CWD,
    followSymlinks: false,
    ignoreInitial: true,
  };

  if (dependencies.length > 0) {
    console.log(chalk.bold.yellow(`[ INIT OF MODULES OBSERVATION ]`));
    console.log("");

    const globalNodeModulePath = getGlobalNodeModulePath();
    const observedModules: string[] = [];

    for (const dependency of dependencies) {
      const dependencyGlobalPath = path.resolve(globalNodeModulePath, dependency);

      if (fs.existsSync(dependencyGlobalPath)) {
        console.log(chalk.yellow(`[ OBSERVED MODULE: ${dependencyGlobalPath} ]`));

        observedModules.push(path.resolve(dependencyGlobalPath, REARGUARD_DEV_CONFIG_FILE_NAME));
      }
    }
    console.log("");

    if (observedModules.length > 0) {
      watcher = watch(observedModules, chokidarOptions);

      await new Promise((resolve, reject): void => {
        if (watcher) {
          const errorHandler = (error: Error): void => {
            shutdown();

            console.error(error);

            reject(error);
          };

          watcher.on("ready", () => {
            if (watcher) {
              watcher.off("error", errorHandler);
            }

            resolve();
          });
          watcher.on("error", errorHandler);
        }
      });

      watcher.on("error", (error: Error): void => console.error(error));
      watcher.on("all", async (type: string, observedFile: string) => {
        if (!inProgress) {
          const rearguardLocalConfig = new RearguardDevConfig(CWD, observedFile);
          const status = await rearguardLocalConfig.getStatus();

          if (status === "done" && !inProgress) {
            // ! Every time will happens error if will start rebuild all dependency in monorepo
            // ! For prevent this situation need make communication between rearguard process
            // ! through OS.
            // * Or create fine into global node_modules, for checking, has other build process or not.
            console.log(chalk.yellow(`[ OBSERVED FILE CHANGED: ${observedFile} ]`));
            console.log("");

            inProgress = true;

            // ! Перед началом работы необходимо занять очередь, чтобы никто больше не выполнял работ
            // ! Before starting work, it is necessary to take a turn so that no one else can perform the work
            await processQueue.getInQueue(name);

            await buildOutdatedDependency(CWD);
            await copyGlobalLinkedModules(CWD);

            if (isBrowser || isIsomorphic) {
              await deleteExternalBundles(CWD, true);
              await copyBundlesToProject(CWD);
            }

            pubSub.emit(events.SYNCED);

            // ! После окончания работ необходимо освободить очередь, для того чтобы другие желающие могли выполнить работу
            // ! After the work is finished, the queue must be vacated so that others can do the work
            await processQueue.getOutQueue(name);

            inProgress = false;

            console.log(chalk.yellow(`[ PROCESSING OF CHANGES IS COMPLETE: ${observedFile} ]`));
            console.log("");
          }
        }
      });
    } else {
      console.log(chalk.bold.yellow(`[ THERE ARE NO OBSERVABLE MODULES ]`));
      console.log("");
    }
  }
};
