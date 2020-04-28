import chalk from "chalk";
import { watch } from "chokidar";
import debounce from "lodash.debounce";
import execa from "execa";
import fs from "fs";
import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { pubSub, events } from "../../helpers/pubSub";

let inProgress = false;

let watcher: fs.FSWatcher | undefined;

export const watchCurrentModules = async (CWD: string): Promise<void> => {
  const shutdown = (): void => {
    if (watcher) {
      console.log(chalk.bold.yellow(`[ CLOSE WATCHER FOR CURRENT MODULE OBSERVATION ]`));
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

  const chokidarOptions = {
    cwd: CWD,
    followSymlinks: false,
    ignoreInitial: true,
  };

  const directoryForWatching = path.resolve(CWD, rearguardConfig.getContext());

  console.log(chalk.bold.yellow(`[ INIT OF CURRENT MODULE OBSERVATION ]`));
  console.log("");

  console.log(chalk.yellow(`[ OBSERVATION FOR DIRECTORY: ${directoryForWatching} ]`));
  console.log("");

  watcher = watch(directoryForWatching, chokidarOptions);

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

  const reBuild = debounce(async (type, observedFiles) => {
    if (!inProgress) {
      console.log(
        chalk.yellow(
          `[ CHANGE REASON: ${chalk.bold.cyan(type)}, FILE CHANGED: ${chalk.bold.cyan(
            observedFiles,
          )} ]`,
        ),
      );
      console.log("");

      inProgress = true;

      const execaOptions: execa.Options = {
        cwd: CWD,
        stdout: "inherit",
        stderr: "inherit",
      };

      await execa("npm", ["run", "build"], execaOptions);

      inProgress = false;

      console.log(
        chalk.yellow(
          `[ CHANGE REASON: ${chalk.bold.cyan(
            type,
          )}, PROCESSING OF CHANGES IS COMPLETE: ${chalk.bold.cyan(observedFiles)} ]`,
        ),
      );
      console.log("");
    }
  }, 3000);

  watcher.on("error", (error: Error): void => console.error(error));
  watcher.on("all", reBuild);

  pubSub.on(events.SYNCED, () => reBuild(events.SYNCED, events.SYNCED));
};
