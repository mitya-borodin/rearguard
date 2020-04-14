import chalk from "chalk";
import execa from "execa";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { applyHackForForceReCompile } from "../../helpers/applyHackForForceReCompile";
import { getTypescriptNodeDevBin } from "../../helpers/dependencyPaths";
import { events, pubSub } from "../../helpers/pubSub";

export const runNodeServer = async (CWD: string): Promise<void> => {
  console.log(chalk.bold.blue(`[ RUN NODE-SERVER ]`));
  console.log("");

  const rearguardConfig = new RearguardConfig(CWD);
  const bin = rearguardConfig.getBin();
  const execaOptions: execa.Options = {
    cwd: CWD,
    stdout: "inherit",
    stderr: "inherit",
  };

  try {
    // ! HACK for forcing invalidation of the ts-node-dev
    pubSub.on(events.SYNCED, async () => {
      await applyHackForForceReCompile(bin);
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
        bin,
      ],
      execaOptions,
    );
  } catch (error) {
    console.error(chalk.bold.magenta(error.message));
    console.log(error);
  }
};
