import chalk from "chalk";
import * as del from "del";
import * as fs from "fs";
import { snakeCase } from "lodash";
import * as path from "path";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, LIB_DIR_NAME } from "../../const";
import { getSortedListOfDependencies } from "./getSortedListOfDependencies";

export const deleteExternalBundles = async (CWD: string, deleteAll = false): Promise<void> => {
  const dependencies = await getSortedListOfDependencies(CWD);
  const pathToDllBundleDir = path.resolve(CWD, DLL_BUNDLE_DIR_NAME);
  const pathToLibBundleDir = path.resolve(CWD, LIB_BUNDLE_DIR_NAME);
  const pathToLibDir = path.resolve(CWD, LIB_DIR_NAME);
  const needDelete: string[] = [];

  if (deleteAll) {
    if (fs.existsSync(pathToLibDir)) {
      needDelete.push(pathToLibDir);
    }

    if (fs.existsSync(pathToDllBundleDir)) {
      needDelete.push(pathToDllBundleDir);
    }

    if (fs.existsSync(pathToLibBundleDir)) {
      needDelete.push(pathToLibBundleDir);
    }
  } else {
    for (const dependency of dependencies) {
      const externalSnakeName = snakeCase(dependency);

      if (fs.existsSync(pathToDllBundleDir)) {
        needDelete.push(path.resolve(CWD, DLL_BUNDLE_DIR_NAME, externalSnakeName));
      }

      if (fs.existsSync(pathToLibBundleDir)) {
        needDelete.push(path.resolve(CWD, LIB_BUNDLE_DIR_NAME, externalSnakeName));
      }
    }
  }

  const paths = await del(needDelete);

  if (fs.existsSync(pathToDllBundleDir) && fs.readdirSync(pathToDllBundleDir).length === 0) {
    for (const path of await del(pathToDllBundleDir)) {
      paths.push(path);
    }
  }

  if (fs.existsSync(pathToLibBundleDir) && fs.readdirSync(pathToLibBundleDir).length === 0) {
    for (const path of await del(pathToLibBundleDir)) {
      paths.push(path);
    }
  }

  if (paths.length > 0) {
    console.log(chalk.bold.gray(`[ CLEAN ]`));

    for (const item of paths) {
      console.log(chalk.gray(`[ REMOVE ][ ${path.relative(process.cwd(), item)} ]`));
    }

    console.log("");
  }
};
