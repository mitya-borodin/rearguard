import chalk from "chalk";
import * as copy from "copy";
import * as del from "del";
import * as fs from "fs";
import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { getGlobalNodeModulePath, getLocalNodeModulePath } from "../../helpers/dependencyPaths";
import { mkdir } from "../../helpers/mkdir";
import { getSortedListOfDependencies } from "./getSortedListOfDependencies";
import File = require("vinyl");

export const copyGlobalLinkedModules = async (CWD: string): Promise<void> => {
  const dependencies = await getSortedListOfDependencies(CWD);

  if (dependencies.length === 0) {
    return;
  }

  console.log(chalk.bold.blue(`[ COPY GLOBAL LINKED MODULES TO LOCAL NODE_MODULES ]`));
  console.log("");

  const rearguardConfig = new RearguardConfig(CWD);
  const globalNodeModulePath = await getGlobalNodeModulePath();
  const localNodeModulePath = getLocalNodeModulePath(CWD);

  const globalLinkedModules: Array<[string, string]> = [];
  const localPathForLinkedModules: string[] = [];

  // * Collect paths to global linked modules.
  // * Collect paths to local placement for global linked modules.
  for (const dependency of dependencies) {
    const dependencyGlobalPath = path.resolve(globalNodeModulePath, dependency);
    const dependencyLocalPath = path.resolve(localNodeModulePath, dependency);

    if (fs.existsSync(dependencyGlobalPath)) {
      globalLinkedModules.push([dependency, dependencyGlobalPath]);

      localPathForLinkedModules.push(dependencyLocalPath);

      console.log(chalk.white(`[ USED ][ GLOBAL_MODULE: ${dependencyGlobalPath} ]`));
    } else if (fs.existsSync(dependencyLocalPath)) {
      console.log(chalk.bold.yellow(`[ USED ][ LOCAL_MODULE: ${dependencyLocalPath} ]`));
    } else {
      console.log(
        chalk.red(
          `[ ERROR ][ You haven't link in global node_modules ${dependencyGlobalPath} or local node_modules ${dependencyLocalPath} ]`,
        ),
      );
      console.log(
        chalk.red(
          `[ ERROR ][ You need go to the project and do [ npm link || npm install ] needs module ]`,
        ),
      );

      process.exit(1);
    }
  }

  const moduleCopyingTasks: Array<[string, string, string[]]> = [];

  // * Prepare data for copy
  for (const [name, CWD] of globalLinkedModules) {
    const rearguardConfig = new RearguardConfig(CWD);
    const pkgPath = rearguardConfig.pathToPackageJsonFile;
    const pkgVersion = rearguardConfig.getVersion();
    const pkgFiles = rearguardConfig.getFiles();
    const patternForFiles: string[] = [pkgPath];

    for (const pkgFile of pkgFiles) {
      const pkgFilePath = path.resolve(CWD, pkgFile);

      if (fs.existsSync(pkgFilePath)) {
        patternForFiles.push(`${pkgFilePath}/**`);
      } else {
        console.log(chalk.red(`[ COPY_TASK ][ ERROR ][ module haven't file: ${pkgFilePath} ]`));
        console.log("");
        process.exit(1);
      }
    }

    moduleCopyingTasks.push([name, pkgVersion, patternForFiles]);
  }

  // ! Remove local copies of global linked modules.
  // ! Create empty directory for local placement for global linked modules.
  for (const localPathForLinkedModule of localPathForLinkedModules) {
    if (fs.existsSync(localPathForLinkedModule)) {
      const paths = await del(localPathForLinkedModule);

      for (const item of paths) {
        console.log(chalk.gray(`[ MODULE ][ REMOVE ][ ${path.relative(CWD, item)} ]`));
      }

      await mkdir(localPathForLinkedModule);

      const relativePathToLocalModule = path.relative(CWD, localPathForLinkedModule);

      console.log(chalk.green(`[ MODULE ][ CREATED ][ DIR ][ ${relativePathToLocalModule} ]`));
    }
  }

  // ! Copy global linked modules to local node_modules.
  for (const [name, pkgVersion, patternForFiles] of moduleCopyingTasks) {
    await new Promise((resolve, reject): void => {
      copy(
        patternForFiles,
        path.resolve(localNodeModulePath, name),
        (error: Error | null, files?: File[]): void => {
          if (!error) {
            if (files) {
              console.log(chalk.cyan(`[ MODULE ][ COPY ][ ${name} ][ ${files.length} FILES ]`));
            }

            resolve();
          } else {
            reject(error);
          }
        },
      );
    });

    await rearguardConfig.setDependencyVersion(name, pkgVersion);
  }

  console.log("");
};
