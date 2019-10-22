import chalk from "chalk";
import * as path from "path";
import * as fs from "fs";
import { watch } from "chokidar";
import { getSortedListOfDependencies } from "./getSortedListOfDependencies";
import { getGlobalNodeModulePath } from "../../helpers/dependencyPaths";
import { REARGUARD_LOCAL_CONFIG_FILE_NAME } from "../../const";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { events, pubSub } from "../../helpers/pubSub";
import { buildOutdatedDependency } from "./buildOutdatedDependency";
import { deleteExternalBundles } from "./deleteExternalBundles";
import { copyGlobalLinkedModules } from "./copyGlobalLinkedModules";
import { copyBundlesToProject } from "./copyBundlesToProject";
import { RearguardConfig } from "../../configs/RearguardConfig";

let inProgress = false;

let watcher: fs.FSWatcher | undefined;

export const watchLinkedModules = async (CWD: string): Promise<void> => {
  const shutdown = (): void => {
    if (watcher) {
      console.log(chalk.bold.yellow(`[ CLOSE WATCHER FOR MODULES OBSERVATION ]`));
      console.log("");

      watcher.removeAllListeners();
      watcher.close();
      watcher = undefined;
    }
  };

  shutdown();

  const rearguardConfig = new RearguardConfig(CWD);
  const isBrowser = rearguardConfig.isBrowser();
  const isIsomorphic = rearguardConfig.isIsomorphic();
  const dependencies = await getSortedListOfDependencies(CWD);
  const chokidarOptions = {
    cwd: CWD,
    followSymlinks: false,
    ignoreInitial: true,
  };

  if (dependencies.length > 0) {
    console.log(chalk.bold.yellow(`[ INIT OF MODULES OBSERVATION ]`));
    console.log("");

    const globalNodeModulePath = await getGlobalNodeModulePath();
    const observedModules: string[] = [];

    for (const dependency of dependencies) {
      const dependencyGlobalPath = path.resolve(globalNodeModulePath, dependency);

      if (fs.existsSync(dependencyGlobalPath)) {
        console.log(chalk.yellow(`[ OBSERVED MODULE: ${dependencyGlobalPath} ]`));

        observedModules.push(path.resolve(dependencyGlobalPath, REARGUARD_LOCAL_CONFIG_FILE_NAME));
      }
    }

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
          const rearguardLocalConfig = new RearguardLocalConfig(CWD, observedFile);
          const status = await rearguardLocalConfig.getStatus();

          if (status === "done" && !inProgress) {
            // ! Every time will happens error if will start rebuild all dependency in monorepo
            // ! For prevent this situation need make communication between rearguard process
            // ! through OS.
            // * Or create fine into global node_modules, for checking, has other build process or not.
            console.log(chalk.yellow(`[ OBSERVED FILE CHANGED: ${observedFile} ]`));
            console.log("");

            inProgress = true;

            await buildOutdatedDependency(CWD);
            await copyGlobalLinkedModules(CWD);

            if (isBrowser || isIsomorphic) {
              await deleteExternalBundles(CWD, true);
              await copyBundlesToProject(CWD);
            }

            pubSub.emit(events.SYNCED);

            inProgress = false;

            console.log(chalk.yellow(`[ PROCESSING OF CHANGES IS COMPLETE: ${observedFile} ]`));
            console.log("");
          }
        }
      });

      process.on("beforeExit", (code) => {
        console.log(chalk.bold.yellow(`[ BEFORE_EXIT ][ CODE: ${code} ]`));
        console.log("");

        shutdown();
      });

      // tslint:disable-next-line no-identical-functions
      process.on("SIGTERM", () => {
        console.log(chalk.bold.yellow(`[ SIGTERM ]`));
        console.log("");

        shutdown();
      });

      process.once("SIGUSR2", async () => {
        console.log(chalk.bold.yellow(`[ SIGUSR2 ]`));
        console.log("");

        shutdown();
      });

      process.on("unhandledRejection", (reason, promise) => {
        console.log(chalk.bold.yellow(`[ unhandledRejection ]`), { reason, promise });
        console.log("");

        shutdown();
      });

      process.on("uncaughtException", (error) => {
        console.log(chalk.bold.yellow(`[ uncaughtException ]`));
        console.error(error);
        console.log("");

        shutdown();
      });
    } else {
      console.log(chalk.bold.yellow(`[ THERE ARE NO OBSERVABLE MODULES ]`));
      console.log("");
    }
  }
};
