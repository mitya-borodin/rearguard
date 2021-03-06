import chalk from "chalk";
import execa from "execa";
import path from "path";
import { RearguardConfig } from "../../../configs/RearguardConfig";
import { getTypescriptBin } from "../../../helpers/dependencyPaths";
import { TS_CONFIG_FILE_NAME, LIB_DIR_NAME } from "../../../const";

export const buildLib = async (CWD: string, emitDeclarationOnly = false): Promise<void> => {
  console.log(chalk.bold.blue(`[ TSC ][ ASSEMBLY ]`));
  // * Create rearguard configs;
  const rearguardConfig = new RearguardConfig(CWD);

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
        path.resolve(CWD, rearguardConfig.getContext()),
        "--outDir",
        path.resolve(CWD, LIB_DIR_NAME),
        "--module",
        "commonjs",
        ...(emitDeclarationOnly ? ["--emitDeclarationOnly"] : []),
        "--declaration",
      ],
      execaOptions,
    );
  } catch (error) {
    console.error(error);
  }
  console.log("");
};
