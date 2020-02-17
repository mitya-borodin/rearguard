import chalk from "chalk";
import execa from "execa";
import fs from "fs";
import ora from "ora";
import path from "path";
import { getSortedListOfDependencies } from "../getSortedListOfDependencies";
import { getGlobalNodeModulePath, getLocalNodeModulePath } from "../../../helpers/dependencyPaths";
import { RearguardConfig } from "../../../configs/RearguardConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, LIB_DIR_NAME } from "../../../const";
import { getBundleSubDir } from "../../../helpers/bundleNaming";
import { promisify } from "util";

const exist = promisify(fs.exists);

export const buildUnfinishedDependencies = async (CWD: string): Promise<void> => {
  const dependencies = await getSortedListOfDependencies(CWD);
  const globalNodeModulePath = getGlobalNodeModulePath();
  const localNodeModulePath = getLocalNodeModulePath(CWD);
  const unfinishedDependencies: Set<string> = new Set();

  // * Collect unfinished deps
  for (const dependency of dependencies) {
    let dependencyPath = "";

    const dependencyGlobalPath = path.resolve(globalNodeModulePath, dependency);
    const dependencyLocalPath = path.resolve(localNodeModulePath, dependency);

    if (await exist(dependencyLocalPath)) {
      dependencyPath = dependencyLocalPath;
    } else if (await exist(dependencyGlobalPath)) {
      dependencyPath = dependencyGlobalPath;
    }

    if (dependencyPath === "") {
      console.log(chalk.red.bold(`!!! ERROR !!!`));
      console.log("");
      console.log(chalk.red(`${dependency} not found`));
      console.log("");
      console.log(chalk.red(`Global path to dependency: ${dependencyGlobalPath}`));
      console.log(chalk.red(`Local path to dependency: ${dependencyLocalPath}`));
      console.log("");
      console.trace(chalk.red.bold(`Path to ${dependency} not found`));

      process.exit(1);
    }

    const rearguardConfig = new RearguardConfig(dependencyPath);

    const pkgFiles = rearguardConfig.getFiles();
    const snakeName = rearguardConfig.getSnakeName();

    for (const pkgFile of pkgFiles) {
      const pkgFilePath = path.resolve(dependencyPath, pkgFile);

      if (pkgFile === DLL_BUNDLE_DIR_NAME || pkgFile === LIB_BUNDLE_DIR_NAME) {
        if (!(await exist(pkgFilePath))) {
          // ! If DLL_BUNDLE_DIR_NAME or LIB_BUNDLE_DIR_NAME doesn't exist
          unfinishedDependencies.add(dependencyPath);
        } else {
          const devSubDir = path.resolve(dependencyPath, pkgFile, snakeName, getBundleSubDir(true));
          const prodSubDir = path.resolve(
            dependencyPath,
            pkgFile,
            snakeName,
            getBundleSubDir(false),
          );

          if (!(await exist(devSubDir)) || !(await exist(prodSubDir))) {
            // ! If SUB_DIR doesn't exist
            unfinishedDependencies.add(dependencyPath);
          } else if ((await exist(devSubDir)) && fs.readdirSync(devSubDir).length === 0) {
            // ! If DEV_SUB_DIR hasn't items
            unfinishedDependencies.add(dependencyPath);
          } else if ((await exist(prodSubDir)) && fs.readdirSync(prodSubDir).length === 0) {
            // ! If PROD_SUB_DIR hasn't items
            unfinishedDependencies.add(dependencyPath);
          }
        }
      } else if (pkgFile === LIB_DIR_NAME) {
        // ! If LIB_DIR_NAME doesn't exist
        if (!(await exist(pkgFilePath))) {
          unfinishedDependencies.add(dependencyPath);
          // ! If LIB_DIR_NAME hasn't items
        } else if (fs.readdirSync(pkgFilePath).length === 0) {
          unfinishedDependencies.add(dependencyPath);
        }
      }
    }
  }

  // * Build unfinished deps
  if (unfinishedDependencies.size > 0) {
    console.log(chalk.bold.blue(`[ BUILD UNFINISHED DEPENDENCIES ]`));
    console.log("");

    for (const dependency of unfinishedDependencies) {
      const dirNames = dependency.split("/");
      console.log(chalk.blue(`${dirNames[dirNames.length - 1]}: ${dependency}`));
    }
    console.log("");

    for (const dependency of unfinishedDependencies) {
      const dirNames = dependency.split("/");
      const spinner = ora(`build: ${dirNames[dirNames.length - 1]}`).start();

      try {
        await execa("npm", ["run", "build", "--", "--bypass_the_queue"], { cwd: dependency });

        if (spinner) {
          spinner.succeed();
        }
      } catch (error) {
        if (spinner) {
          spinner.fail();
        }
        console.error(error);
      }
    }
  }
};
