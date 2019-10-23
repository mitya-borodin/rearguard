import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { getGlobalNodeModulePath, getLocalNodeModulePath } from "../../helpers/dependencyPaths";
import { getSortedListOfDependencies } from "./getSortedListOfDependencies";

export const getOutdatedDependency = async (CWD: string): Promise<Set<string>> => {
  // * Result dependency Set
  const outdatedDependency: Set<string> = new Set();

  // * Prepare data
  const globalNodeModulePath = getGlobalNodeModulePath();
  const localNodeModulePath = getLocalNodeModulePath(CWD);

  // ! Look through the dependencies of the current project
  for (const i_module of await getSortedListOfDependencies(CWD)) {
    const i_modulePath = path.resolve(globalNodeModulePath, i_module);

    if (fs.existsSync(i_modulePath)) {
      // * Here we are will work with dependencies of the current project
      const i_moduleLocalConfig = new RearguardLocalConfig(i_modulePath);

      if (await i_moduleLocalConfig.hasLastBuildTime()) {
        const i_moduleProjectDeps = await getSortedListOfDependencies(i_modulePath);
        const i_moduleLastBuildTime = await i_moduleLocalConfig.getLastBuildTime();

        // ! Look through the dependencies of each dependence of the current project
        for (let k = i_moduleProjectDeps.length - 1; k >= 0; k--) {
          const k_modulePath = path.resolve(globalNodeModulePath, i_moduleProjectDeps[k]);

          if (fs.existsSync(k_modulePath)) {
            const k_moduleLocalConfig = new RearguardLocalConfig(k_modulePath);

            if (await k_moduleLocalConfig.hasLastBuildTime()) {
              const k_moduleLastBuildTime = await k_moduleLocalConfig.getLastBuildTime();

              // * I_MODULE_LAST_BUILD_TIME <= K_MODULE_LAST_BUILD_TIME
              if (i_moduleLastBuildTime.isSameOrBefore(k_moduleLastBuildTime)) {
                outdatedDependency.add(i_modulePath);
                break;
              }
            } else {
              outdatedDependency.add(i_modulePath);
            }
          } else {
            console.log(
              chalk.bold.grey(`[ MODULE_SET_FOR_RE_BUILD ][ ${k_modulePath} ][ NOT_FOUND ]`),
            );
          }
        }
      } else {
        outdatedDependency.add(i_modulePath);
      }
    } else if (fs.existsSync(path.resolve(localNodeModulePath, i_module))) {
      console.log(chalk.grey(`[ MODULE_SET_FOR_RE_BUILD ][ ${i_module} ][ LOCAL_INSTALLED ]`));
    } else {
      console.log(chalk.grey(`[ MODULE_SET_FOR_RE_BUILD ][ ${i_module} ][ NOT_FOUND ]`));
    }
  }

  return outdatedDependency;
};
