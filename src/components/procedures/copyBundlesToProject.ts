import chalk from "chalk";
import * as del from "del";
import * as fs from "fs";
import * as copy from "copy";
import * as path from "path";
import { getSortedListOfDependencies } from "./getSortedListOfDependencies";
import { getLocalNodeModulePath } from "../../helpers/dependencyPaths";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME } from "../../const";
import { mkdir } from "../../helpers/mkdir";

export const copyBundlesToProject = async (CWD: string): Promise<void> => {
  const dependencies = await getSortedListOfDependencies(CWD);
  const localNodeModulePath = getLocalNodeModulePath();

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
      await mkdir(dllDestination);

      const relativePath = path.relative(process.cwd(), dllDestination);

      console.log(
        chalk.green(`[ CREATED ][ DLL ][ BUNDLE ][ DIR ][ ${snakeName} ][ ${relativePath} ]`),
      );
    }

    // ! Copy dll bundle files
    await new Promise((resolve, reject): void => {
      copy([`${dllSource}/**`], dllDestination, (error: any, items: any[]) => {
        if (!error) {
          console.log(
            chalk.cyan(`[ COPY ][ DLL ][ BUNDLE ][ ${snakeName} ][ ${items.length} FILES ]`),
          );

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
      await mkdir(libDestination);

      const relativePath = path.relative(process.cwd(), libDestination);

      console.log(
        chalk.green(`[ CREATED ][ LIB ][ BUNDLE ][ DIR ][ ${snakeName} ][ ${relativePath} ]`),
      );
    }

    // ! Copy lib bundle files
    await new Promise((resolve, reject): void => {
      copy([`${libSource}/**`], libDestination, (error: any, items: any[]) => {
        if (!error) {
          console.log(
            chalk.cyan(`[ COPY ][ LIB ][ BUNDLE ][ ${snakeName} ][ ${items.length} FILES ]`),
          );

          resolve();
        } else {
          reject(error);
        }
      });
    });

    console.log("");
  }
};
