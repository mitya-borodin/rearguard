import chalk from "chalk";
import * as execa from "execa";
import * as path from "path";
import { DISTRIBUTIVE_DIR_NAME, TS_CONFIG_FILE_NAME } from "../../const";
import { getTypescriptBin } from "../../helpers/dependencyPaths";

export const buildNodeApp = async (CWD: string): Promise<void> => {
  console.log(chalk.bold.blue(`[ TSC ][ ASSEMBLY ]`));
  // * Prepare execa options.
  const execaOptions: execa.Options = {
    stdout: "inherit",
    stderr: "inherit",
  };

  try {
    await execa(
      await getTypescriptBin(CWD),
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
