import chalk from "chalk";
import * as path from "path";
import * as execa from "execa";
import { getTypescriptNodeDevBin } from "../../helpers/dependencyPaths";
import { RearguardConfig } from "../../configs/RearguardConfig";

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
    await execa(
      getTypescriptNodeDevBin(CWD),
      ["--clear", "--prefer-ts", "--type-check", "--respawn", entryPath],
      execaOptions,
    );
  } catch (error) {
    console.error(error);
  }
};
