import chalk from "chalk";
import execa from "execa";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { getLocalNodeModulePath } from "../../helpers/dependencyPaths";
import { getSortedListOfDependencies } from "./getSortedListOfDependencies";

const exist = promisify(fs.exists);

export const checkNotInstalledDependencies = async (CWD: string): Promise<void> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const dependencies = await getSortedListOfDependencies(CWD);
  const localNodeModulePath = getLocalNodeModulePath(CWD);

  const dependenciesWhichShouldBeInstalled: string[] = [];

  for (const dependency of dependencies) {
    const dependencyLocalPath = path.resolve(localNodeModulePath, dependency);

    if (!(await exist(dependencyLocalPath))) {
      const unPublishedDependency = rearguardConfig.getUnPublishedDependency();

      if (!unPublishedDependency.includes(dependency)) {
        dependenciesWhichShouldBeInstalled.push(dependency);
      }
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

    try {
      await execa("npm", ["install", "-S", "-E", ...dependenciesWhichShouldBeInstalled], {
        stdout: "inherit",
        stderr: "inherit",
      });
    } catch (error) {
      console.error(error);
    }

    console.log("");
  }
};
