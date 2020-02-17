import chalk from "chalk";
import execa from "execa";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { getGlobalNodeModulePath, getLocalNodeModulePath } from "../../helpers/dependencyPaths";
import { getSortedListOfDependencies } from "./getSortedListOfDependencies";

const exist = promisify(fs.exists);

export const checkNotInstalledDependencies = async (CWD: string): Promise<void> => {
  const dependencies = await getSortedListOfDependencies(CWD);
  const globalNodeModulePath = getGlobalNodeModulePath();
  const localNodeModulePath = getLocalNodeModulePath(CWD);

  const dependenciesWhichShouldBeInstalled: string[] = [];

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
      dependenciesWhichShouldBeInstalled.push(dependency);
    }
  }

  if (dependenciesWhichShouldBeInstalled.length > 0) {
    const list = dependenciesWhichShouldBeInstalled.join("\n");

    console.log(chalk.yellow.bold(`!!! ATTENTION !!!`));
    console.log("");
    console.log(chalk.yellow.bold(`Right now will installed dependencies`));
    console.log("");
    console.log(chalk.yellow(list));
    console.log("");

    console.log(chalk.blue(`npm install -S -E ${dependenciesWhichShouldBeInstalled.join(" ")}`));
    console.log("");

    await execa("npm", ["install", "-S", "-E", ...dependenciesWhichShouldBeInstalled], {
      stdout: "inherit",
      stderr: "inherit",
    });
    console.log("");
  }
};
