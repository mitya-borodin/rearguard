import chalk from "chalk";
import * as del from "del";
import { existsSync, readdirSync } from "fs";
import { snakeCase } from "lodash";
import * as path from "path";
import { envConfig } from "../../config/env";
import { rearguardConfig } from "../../config/rearguard";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, LIB_DIR_NAME } from "../../const";

// tslint:disable:variable-name

export async function delete_bundles() {
  if (envConfig.isBuild && (envConfig.has_dll || envConfig.has_ui_lib || envConfig.has_node_lib)) {
    const { pkg } = rearguardConfig;
    const cur_bundle_name = snakeCase(pkg.name);
    const dll_bundle_dir = path.resolve(process.cwd(), DLL_BUNDLE_DIR_NAME);
    const lib_bundle_dir = path.resolve(process.cwd(), LIB_BUNDLE_DIR_NAME);
    const lib_dir = path.resolve(process.cwd(), LIB_DIR_NAME);
    const delete_target: string[] = [];

    if (existsSync(lib_dir)) {
      delete_target.push(lib_dir);
    }

    if (existsSync(dll_bundle_dir)) {
      for (const bundle_name of readdirSync(dll_bundle_dir)) {
        if (bundle_name !== cur_bundle_name) {
          delete_target.push(path.resolve(process.cwd(), DLL_BUNDLE_DIR_NAME, bundle_name));
        }
      }
    }

    if (existsSync(lib_bundle_dir)) {
      for (const bundle_name of readdirSync(lib_bundle_dir)) {
        if (bundle_name !== cur_bundle_name) {
          delete_target.push(path.resolve(process.cwd(), LIB_BUNDLE_DIR_NAME, bundle_name));
        }
      }
    }

    const paths = await del(delete_target);

    for (const item of paths) {
      console.log(chalk.gray(`[ LOCAL_COPY_OF_BUNDLE ][ REMOVE ][ ${path.relative(process.cwd(), item)} ]`));
    }

    console.log("");
  }
}

// tslint:enable:variable-name
