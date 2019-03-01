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

  const cur_dep_list = rearguardConfig.sync_project_deps;
  const CWD_list: string[] = [];

  for (const i_dep_name of cur_dep_list) {
    const i_local_dep = envConfig.resolveLocalModule(i_dep_name);
    const i_global_dep = envConfig.resolveGlobalModule(i_dep_name);

    if (fs.existsSync(i_global_dep)) {
      const i_rearguardConfig = new RearguardConfig(envConfig, path.resolve(i_global_dep, "package.json"));
      const i_buildStatusConfig = new BuildStatusConfig(path.resolve(i_global_dep, NON_VERSIONABLE_CONFIG_FILE_NAME));
      const i_deps = i_rearguardConfig.sync_project_deps;
      const i_has_last_build_time = i_buildStatusConfig.has_last_build_time;

      if (i_has_last_build_time) {
        const i_build_time = i_buildStatusConfig.last_build_time;

        for (let k = i_deps.length - 1; k >= 0; k--) {
          const k_dep_name = i_deps[k];
          const k_global_dep = envConfig.resolveGlobalModule(k_dep_name);

          if (fs.existsSync(k_global_dep)) {
            const k_buildStatusConfig = new BuildStatusConfig(
              path.resolve(k_global_dep, NON_VERSIONABLE_CONFIG_FILE_NAME),
            );
            const k_has_last_build_time = k_buildStatusConfig.has_last_build_time;

            if (k_has_last_build_time) {
              const k_build_time = k_buildStatusConfig.last_build_time;

              if (i_build_time.isSameOrBefore(k_build_time)) {
                CWD_list.push(i_global_dep);
                break;
              }
            } else if (!CWD_list.includes(i_global_dep)) {
              CWD_list.push(i_global_dep);
            }
          } else {
            console.log(chalk.bold.grey(`[ GLOBAL_MODULE: ${k_dep_name} ][ NOT_FOUND ]`));
          }
        }
      } else if (!CWD_list.includes(i_global_dep)) {
        CWD_list.push(i_global_dep);
      }
    } else if (fs.existsSync(i_local_dep)) {
      console.log(chalk.grey(`[ MODULE: ${i_dep_name} ][ LOCAL_INSTALED ]`));
    } else {
      console.log(chalk.grey(`[ MODULE: ${i_dep_name} ][ NOT_FOUND ]`));
    }
  }

  if (CWD_list.length > 0) {
    console.log(chalk.bold.yellowBright(`[ TARGET_LIST ]`));
    console.log(chalk.bold.yellowBright(JSON.stringify(CWD_list, null, 2)));
  } else {
    console.log(chalk.grey(`[ HAVE_NOT_TARGETS ]`));
  }

  for (const CWD of CWD_list) {
    await build(CWD);
  }

  console.log("");
  console.log(chalk.bold.white(`[ BUILD_INTERMEDIATE_DEPENDENCIES ][ END ]`));
  console.log("");
}

// tslint:enable: variable-name
