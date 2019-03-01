import * as path from "path";
import * as webpack from "webpack";
import { LIB_BUNDLE_DIR_NAME } from "../const";
import { get_context, lib_entry_name, lib_output_path } from "../helpers";
import { IEnvConfig } from "../interfaces/config/IEnvConfig";
import { IRearguardConfig } from "../interfaces/config/IRearguardConfig";
import { analyze, assetsPlugin, clean, DllReferencePlugin } from "./components/js.plugins";
import tsLoader from "./components/ts.loaders";
import { general_WP_config } from "./webpack.config.common";

// tslint:disable:object-literal-sort-keys

export function library_WP_config(envConfig: IEnvConfig, rearguardConfig: IRearguardConfig): webpack.Configuration {
  const { lib_entry, bundle_public_path } = rearguardConfig;

  return general_WP_config(
    envConfig,
    rearguardConfig,
    {
      [lib_entry_name()]: path.resolve(get_context(), lib_entry),
    },
    {
      // path - путь куда записываются файлы.
      path: lib_output_path(),
      // publicPath - путь до ресурса с файлами.
      publicPath: bundle_public_path,
      library: lib_entry_name(),
      libraryTarget: "var",
    },
    tsLoader(),
    [
      ...DllReferencePlugin(envConfig, rearguardConfig),
      ...assetsPlugin(envConfig, LIB_BUNDLE_DIR_NAME),
      ...analyze(envConfig),
      ...clean(envConfig, [lib_output_path()]),
    ],
    {},
  );
}

// tslint:enable:object-literal-sort-keys
