import chalk from "chalk";
import execa from "execa";
import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { applyHackForForceReCompile } from "../../helpers/applyHackForForceReCompile";
import { getTypescriptNodeDevBin } from "../../helpers/dependencyPaths";
import { events, pubSub } from "../../helpers/pubSub";

export const runTsNodeDev = async (CWD: string): Promise<void> => {
  console.log(chalk.bold.blue(`[ RUN TS-NODE-DEV ]`));
  console.log("");

  const rearguardConfig = new RearguardConfig(CWD);
  const context = rearguardConfig.getContext();
  const libEntry = rearguardConfig.getLibEntry();
  const entryPath = path.normalize(`${context}/${libEntry}`);
  const execaOptions: execa.Options = {
    cwd: CWD,
    stdout: "inherit",
    stderr: "inherit",
  };

  try {
    // ! HACK for forcing invalidation of the ts-node-dev
    pubSub.on(events.SYNCED, async () => {
      await applyHackForForceReCompile(entryPath);
    });

    await execa(
      getTypescriptNodeDevBin(CWD),
      [
        "--debounce",
        "1000",
        "--ignore-watch",
        "node_modules",
        "--prefer-ts",
        "--type-check",
        "--respawn",
        entryPath,
      ],
      execaOptions,
    );
  } catch (error) {
    console.error(chalk.bold.magenta(error.message));
    console.log(error);
  }
};
