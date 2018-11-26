import chalk from "chalk";
import * as del from "del";
import * as path from "path";
import { envConfig } from "../../config/env";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, LIB_DIR_NAME } from "../../const";

// tslint:disable:variable-name

export async function delete_bundles() {
  if (envConfig.isBuild && (envConfig.has_dll || envConfig.has_ui_lib || envConfig.has_node_lib)) {
    const dll_bundle_dir = path.resolve(process.cwd(), DLL_BUNDLE_DIR_NAME);
    const lib_bundle_dir = path.resolve(process.cwd(), LIB_BUNDLE_DIR_NAME);
    const lib_dir = path.resolve(process.cwd(), LIB_DIR_NAME);

    const paths = await del([dll_bundle_dir, lib_bundle_dir, lib_dir]);

    for (const item of paths) {
      console.log(chalk.gray(`[ LOCAL_COPY_OF_BUNDLE ][ REMOVE ][ ${path.relative(process.cwd(), item)} ]`));
    }

    console.log("");
  }
}

// tslint:enable:variable-name
