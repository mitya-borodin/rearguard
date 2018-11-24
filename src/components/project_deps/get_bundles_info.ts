import chalk from "chalk";
import { snakeCase } from "lodash";
import * as moment from "moment";
import { envConfig } from "../../config/env";
import { rearguardConfig } from "../../config/rearguard";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";
import { dll_assets_path, dll_entry_name, dll_manifest_path, lib_assets_path, lib_entry_name } from "../../helpers";
import { IBundleInfo } from "../../interfaces/IBundleInfo";

// tslint:disable:variable-name object-literal-sort-keys

export function get_bundles_info(): IBundleInfo[] {
  const startTime = moment();

  console.log(chalk.bold.blue(`==============BUNDLES_INFO=============`));
  console.log(chalk.bold.blue(`[ BUNDLES_INFO ][ RUN ][ ${startTime.format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log("");

  /////////////////////
  //
  // START OF PROCEDURE
  //
  /////////////////////

  const result: IBundleInfo[] = [];

  try {
    for (const module of rearguardConfig.sync_project_deps) {
      // Абсолютный путь до директории модуля, который находится в локальном node_modules.
      const module_path = envConfig.resolveLocalModule(module);
      const config = new RearguardConfig(envConfig, module_path);
      const bundle_name = snakeCase(config.pkg.name);

      const bundleInfo: IBundleInfo = {
        has_dll: config.has_dll,
        has_ui_lib: config.has_ui_lib,
        // Имя бандал.
        bundle_name,
        // Абсолютный путь к субдиректории (deb/prod) бандла.
        // Имя точки входа, ключь для assets.
        bundle_entry_name: {
          dll: config.has_dll ? dll_entry_name(bundle_name) : "",
          lib: config.has_ui_lib ? lib_entry_name(bundle_name) : "",
        },
        assets: {
          dll: config.has_dll ? dll_assets_path(module_path, bundle_name) : "",
          lib: config.has_ui_lib ? lib_assets_path(module_path, bundle_name) : "",
        },
        manifest: config.has_dll ? dll_manifest_path(module_path, bundle_name) : "",
      };

      result.push(bundleInfo);
    }
  } catch (error) {
    console.error(error);

    process.exit(1);
  }

  /////////////////////
  //
  // END OF PROCEDURE
  //
  /////////////////////

  const endTime = moment();

  console.log("");
  console.log(
    chalk.bold.blue(`[ BUNDLES_INFO ][ WORK_TIME ][ ${endTime.diff(startTime, "milliseconds")} ][ millisecond ]`),
  );
  console.log(chalk.bold.blue(`[ BUNDLES_INFO ][ DONE ][ ${endTime.format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log(chalk.bold.blue(`=======================================`));
  console.log("");

  return result;
}

// tslint:enable:variable-name
