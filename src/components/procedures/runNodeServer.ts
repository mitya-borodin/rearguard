import chalk from "chalk";
import * as execa from "execa";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { getTypescriptNodeDevBin } from "../../helpers/dependencyPaths";

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
    await execa(
      getTypescriptNodeDevBin(CWD),
      ["--clear", "--prefer-ts", "--type-check", "--respawn", bin],
      execaOptions,
    );
  } catch (error) {
    console.error(chalk.bold.magenta(error.message));
  }
};
