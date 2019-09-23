import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { BuildStatusConfig } from "../config/buildStatus/BuildStatusConfig";
import { RearguardConfig } from "../config/rearguard/RearguardConfig";
import { NON_VERSIONABLE_CONFIG_FILE_NAME } from "../const";
import { IEnvConfig } from "../interfaces/config/IEnvConfig";
import { IRearguardConfig } from "../interfaces/config/IRearguardConfig";
import { build } from "./mono_repository/build";

// tslint:disable: variable-name

export async function build_intermediate_dependencies(
  envConfig: IEnvConfig,
  rearguardConfig: IRearguardConfig,
): Promise<void> {
  console.log(chalk.bold.white(`[ BUILD_INTERMEDIATE_DEPENDENCIES ][ START ]`));
  console.log(chalk.bold.white(`[ FROM: ${rearguardConfig.pkg.name} ]`));
  console.log("");

  // ! CUR_DEPENDECIES_LIST
  const cur_dep_list = rearguardConfig.sync_project_deps;
  // ! REBUIL_LIST
  const target_modules: string[] = [];

  for (const cur_dep_name of cur_dep_list) {
    const cur_local_dep = envConfig.resolveLocalModule(cur_dep_name);
    const cur_global_dep = envConfig.resolveGlobalModule(cur_dep_name);

    if (fs.existsSync(cur_global_dep)) {
      // ! GET_CONFIG_FILEs
      const cur_rearguardConfig = new RearguardConfig(
        envConfig,
        path.resolve(cur_global_dep, "package.json"),
      );
      const cur_buildStatusConfig = new BuildStatusConfig(
        path.resolve(cur_global_dep, NON_VERSIONABLE_CONFIG_FILE_NAME),
      );
      // ! GET_BUILD_INFORMATION
      const cur_deps = cur_rearguardConfig.sync_project_deps;
      const cur_has_last_build_time = cur_buildStatusConfig.has_last_build_time;

      if (cur_has_last_build_time) {
        const cur_build_time = cur_buildStatusConfig.last_build_time;

        for (let k = cur_deps.length - 1; k >= 0; k--) {
          const k_dep_name = cur_deps[k];
          const k_global_dep = envConfig.resolveGlobalModule(k_dep_name);

          if (fs.existsSync(k_global_dep)) {
            // ? GET_TARGET_CONFIG
            const k_buildStatusConfig = new BuildStatusConfig(
              path.resolve(k_global_dep, NON_VERSIONABLE_CONFIG_FILE_NAME),
            );
            // ? GET_TARGET_BUILD_INFORMATION
            const k_has_last_build_time = k_buildStatusConfig.has_last_build_time;

            if (k_has_last_build_time) {
              const k_build_time = k_buildStatusConfig.last_build_time;

              // * CUR_BUILD_TIME <= TARGET_BUILD_TIME
              if (cur_build_time.isSameOrBefore(k_build_time)) {
                target_modules.push(cur_global_dep);
                break;
              }
            } else if (!target_modules.includes(cur_global_dep)) {
              target_modules.push(cur_global_dep);
            }
          } else {
            console.log(chalk.bold.grey(`[ GLOBAL_MODULE: ${k_dep_name} ][ NOT_FOUND ]`));
          }
        }
      } else if (!target_modules.includes(cur_global_dep)) {
        target_modules.push(cur_global_dep);
      }
    } else if (fs.existsSync(cur_local_dep)) {
      console.log(chalk.grey(`[ MODULE: ${cur_dep_name} ][ LOCAL_INSTALED ]`));
    } else {
      console.log(chalk.grey(`[ MODULE: ${cur_dep_name} ][ NOT_FOUND ]`));
    }
  }

  if (target_modules.length > 0) {
    console.log(chalk.bold.yellowBright(`[ TARGET_MODULES ]`));
    console.log(chalk.bold.yellowBright(JSON.stringify(target_modules, null, 2)));
  } else {
    console.log(chalk.grey(`[ HAVE_NOT_TARGETS ]`));
  }

  for (const CWD of target_modules) {
    await build(CWD, true);
  }

  console.log("");
  console.log(chalk.bold.white(`[ BUILD_INTERMEDIATE_DEPENDENCIES ][ END ]`));
  console.log("");
}

// tslint:enable: variable-name
