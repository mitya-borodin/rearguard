import chalk from "chalk";
import execa from "execa";
import path from "path";
import { getTypescriptBin } from "../../../helpers/dependencyPaths";
import { TS_CONFIG_FILE_NAME, DISTRIBUTIVE_DIR_NAME } from "../../../const";

export const buildNodeApp = async (CWD: string): Promise<void> => {
  console.log(chalk.bold.blue(`[ TSC ][ ASSEMBLY ]`));
  // * Prepare execa options.
  const execaOptions: execa.Options = {
    stdout: "inherit",
    stderr: "inherit",
  };

  try {
    await execa(
      getTypescriptBin(CWD),
      [
        "--project",
        path.resolve(CWD, TS_CONFIG_FILE_NAME),
        "--rootDir",
        CWD,
        "--outDir",
        path.resolve(CWD, DISTRIBUTIVE_DIR_NAME),
        "--module",
        "commonjs",
      ],
      execaOptions,
    );
  } catch (error) {
    console.error(error);
  }
  console.log("");
};
