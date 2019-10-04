import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { getGlobalNodeModulePath, getLocalNodeModulePath } from "../../helpers/dependencyPaths";
import * as fs from "fs";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import chalk from "chalk";

export const getModuleSetForReBuild = async (CWD: string): Promise<Set<string>> => {
  // * Result dependency Set
  const moduleSetForReBuild: Set<string> = new Set();

  // * Create rearguard config
  const originRearguardConfig = new RearguardConfig(CWD);

  // * Prepare data
  const globalNodeModulePath = await getGlobalNodeModulePath();
  const localNodeModulePath = getLocalNodeModulePath();

  // ! Look through the dependencies of the current project
  for (const i_module of originRearguardConfig.getProjectDeps()) {
    const i_modulePath = path.resolve(globalNodeModulePath, i_module);

    if (fs.existsSync(i_modulePath)) {
      // * Here we are will work with dependencies of the current project
      const i_moduleLocalConfig = new RearguardLocalConfig(i_modulePath);

      if (i_moduleLocalConfig.has_last_build_time) {
        const i_moduleRearguardConfig = new RearguardConfig(i_modulePath);

        const i_moduleProjectDeps = i_moduleRearguardConfig.getProjectDeps();
        const i_moduleLastBuildTime = i_moduleLocalConfig.last_build_time;

        // ! Look through the dependencies of each dependence of the current project
        for (let k = i_moduleProjectDeps.length - 1; k >= 0; k--) {
          const k_modulePath = path.resolve(globalNodeModulePath, i_moduleProjectDeps[k]);

          if (fs.existsSync(k_modulePath)) {
            const k_moduleLocalConfig = new RearguardLocalConfig(k_modulePath);

            if (k_moduleLocalConfig.has_last_build_time) {
              const k_moduleLastBuildTime = k_moduleLocalConfig.last_build_time;

              // * I_MODULE_LAST_BUILD_TIME <= K_MODULE_LAST_BUILD_TIME
              if (i_moduleLastBuildTime.isSameOrBefore(k_moduleLastBuildTime)) {
                moduleSetForReBuild.add(i_modulePath);
                break;
              }
            } else {
              moduleSetForReBuild.add(i_modulePath);
            }
          } else {
            console.log(
              chalk.bold.grey(`[ MODULE_SET_FOR_RE_BUILD ][ ${k_modulePath} ][ NOT_FOUND ]`),
            );
          }
        }
      } else {
        moduleSetForReBuild.add(i_modulePath);
      }
    } else if (fs.existsSync(path.resolve(localNodeModulePath, i_module))) {
      console.log(chalk.grey(`[ MODULE_SET_FOR_RE_BUILD ][ ${i_module} ][ LOCAL_INSTALLED ]`));
    } else {
      console.log(chalk.grey(`[ MODULE_SET_FOR_RE_BUILD ][ ${i_module} ][ NOT_FOUND ]`));
    }
  }

  return moduleSetForReBuild;
};
