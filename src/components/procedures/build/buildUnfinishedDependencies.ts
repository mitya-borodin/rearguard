import chalk from "chalk";
import * as execa from "execa";
import * as fs from "fs";
import * as ora from "ora";
import * as path from "path";
import { getSortedListOfDependencies } from "../getSortedListOfDependencies";
import { getGlobalNodeModulePath } from "../../../helpers/dependencyPaths";
import { RearguardConfig } from "../../../configs/RearguardConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, LIB_DIR_NAME } from "../../../const";
import { getBundleSubDir } from "../../../helpers/bundleNaming";

export const buildUnfinishedDependencies = async (CWD: string): Promise<void> => {
  const dependencies = await getSortedListOfDependencies(CWD);
  const globalNodeModulePath = getGlobalNodeModulePath();
  const unfinishedDependencies: Set<string> = new Set();

  // * Collect unfinished deps
  for (const dependency of dependencies) {
    const dependencyGlobalPath = path.resolve(globalNodeModulePath, dependency);
    const rearguardConfig = new RearguardConfig(dependencyGlobalPath);
    const pkgFiles = rearguardConfig.getFiles();
    const snakeName = rearguardConfig.getSnakeName();

    for (const pkgFile of pkgFiles) {
      const pkgFilePath = path.resolve(dependencyGlobalPath, pkgFile);

      if (pkgFile === DLL_BUNDLE_DIR_NAME || pkgFile === LIB_BUNDLE_DIR_NAME) {
        if (!fs.existsSync(pkgFilePath)) {
          // ! If DLL_BUNDLE_DIR_NAME or LIB_BUNDLE_DIR_NAME doesn't exist
          unfinishedDependencies.add(dependencyGlobalPath);
        } else {
          const devSubDir = path.resolve(
            dependencyGlobalPath,
            pkgFile,
            snakeName,
            getBundleSubDir(true),
          );
          const prodSubDir = path.resolve(
            dependencyGlobalPath,
            pkgFile,
            snakeName,
            getBundleSubDir(false),
          );

          if (!fs.existsSync(devSubDir) || !fs.existsSync(prodSubDir)) {
            // ! If SUB_DIR doesn't exist
            unfinishedDependencies.add(dependencyGlobalPath);
          } else if (fs.existsSync(devSubDir) && fs.readdirSync(devSubDir).length === 0) {
            // ! If DEV_SUB_DIR hasn't items
            unfinishedDependencies.add(dependencyGlobalPath);
          } else if (fs.existsSync(prodSubDir) && fs.readdirSync(prodSubDir).length === 0) {
            // ! If PROD_SUB_DIR hasn't items
            unfinishedDependencies.add(dependencyGlobalPath);
          }
        }
      } else if (pkgFile === LIB_DIR_NAME) {
        // ! If LIB_DIR_NAME doesn't exist
        if (!fs.existsSync(pkgFilePath)) {
          unfinishedDependencies.add(dependencyGlobalPath);
          // ! If LIB_DIR_NAME hasn't items
        } else if (fs.readdirSync(pkgFilePath).length === 0) {
          unfinishedDependencies.add(dependencyGlobalPath);
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
