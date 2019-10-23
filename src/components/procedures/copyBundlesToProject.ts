import chalk from "chalk";
import * as copy from "copy";
import * as del from "del";
import * as fs from "fs";
import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME } from "../../const";
import { getLocalNodeModulePath } from "../../helpers/dependencyPaths";
import { mkdir } from "../../helpers/mkdir";
import { getSortedListOfDependencies } from "./getSortedListOfDependencies";
import File = require("vinyl");

export const copyBundlesToProject = async (CWD: string): Promise<void> => {
  const dependencies = await getSortedListOfDependencies(CWD);

  if (dependencies.length === 0) {
    return;
  }

  console.log(chalk.bold.blue(`[ COPY BUNDLES FORM LOCAL NODE_MODULES TO PROJECT ]`));
  console.log("");

  const localNodeModulePath = getLocalNodeModulePath(CWD);

  for (const dependency of dependencies) {
    // * Prepare data
    const dependencyLocalPath = path.resolve(localNodeModulePath, dependency);
    const rearguardConfig = new RearguardConfig(dependencyLocalPath);
    const snakeName = rearguardConfig.getSnakeName();

    const dllSource = path.resolve(dependencyLocalPath, DLL_BUNDLE_DIR_NAME, snakeName);
    const libSource = path.resolve(dependencyLocalPath, LIB_BUNDLE_DIR_NAME, snakeName);

    const dllDestination = path.resolve(CWD, DLL_BUNDLE_DIR_NAME, snakeName);
    const libDestination = path.resolve(CWD, LIB_BUNDLE_DIR_NAME, snakeName);

    // ! Remove dll bundle dir
    if (fs.existsSync(dllDestination)) {
      const paths = await del(dllDestination);

      for (const item of paths) {
        const relativePath = path.relative(process.cwd(), item);

        console.log(
          chalk.gray(`[ REMOVE ][ DLL ][ BUNDLE ][ DIR ][ ${snakeName} ][ ${relativePath} ]`),
        );
      }
    }

    // ! Make dll bundle dir
    if (fs.existsSync(dllSource)) {
      mkdir(dllDestination);

      const relativePath = path.relative(process.cwd(), dllDestination);

      console.log(
        chalk.green(`[ CREATED ][ DLL ][ BUNDLE ][ DIR ][ ${snakeName} ][ ${relativePath} ]`),
      );
    }

    // ! Copy dll bundle files
    await new Promise((resolve, reject): void => {
      copy([`${dllSource}/**`], dllDestination, (error: Error | null, files?: File[]) => {
        if (!error) {
          if (files && files.length > 0) {
            console.log(
              chalk.cyan(`[ COPY    ][ DLL ][ BUNDLE ][ ${snakeName} ][ ${files.length} FILES ]`),
            );
          }

          resolve();
        } else {
          reject(error);
        }
      });
    });

    // ! Remove lib bundle dir
    if (fs.existsSync(libDestination)) {
      const paths = await del(libDestination);

      for (const item of paths) {
        const relativePath = path.relative(process.cwd(), item);

        console.log(
          chalk.gray(`[ REMOVE ][ LIB ][ BUNDLE ][ DIR ][ ${snakeName} ][ ${relativePath} ]`),
        );
      }
    }

    // ! Make lib bundle dir
    if (fs.existsSync(libSource)) {
      mkdir(libDestination);

      const relativePath = path.relative(process.cwd(), libDestination);

      console.log(
        chalk.green(`[ CREATED ][ LIB ][ BUNDLE ][ DIR ][ ${snakeName} ][ ${relativePath} ]`),
      );
    }

    // ! Copy lib bundle files
    await new Promise((resolve, reject): void => {
      copy([`${libSource}/**`], libDestination, (error: Error | null, files?: File[]) => {
        if (!error) {
          if (files && files.length > 0) {
            console.log(
              chalk.cyan(`[ COPY    ][ LIB ][ BUNDLE ][ ${snakeName} ][ ${files.length} FILES ]`),
            );
          }

          resolve();
        } else {
          reject(error);
        }
      });
    });
  }

  console.log("");
};
