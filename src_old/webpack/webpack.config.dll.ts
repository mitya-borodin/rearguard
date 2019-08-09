import * as path from "path";
import { buildStatusConfig } from "../config/buildStatus";
import { DLL_BUNDLE_DIR_NAME } from "../const";
import { dll_entry_name, dll_output_path, get_context } from "../helpers";
import { IEnvConfig } from "../interfaces/config/IEnvConfig";
import { IRearguardConfig } from "../interfaces/config/IRearguardConfig";
import { analyze, assetsPlugin, clean, DllPlugin, HashWebpackPlugin } from "./components/js.plugins";
import tsLoader from "./components/ts.loaders";
import { general_WP_config } from "./webpack.config.common";

// tslint:disable:object-literal-sort-keys

export function dll_WP_config(envConfig: IEnvConfig, rearguardConfig: IRearguardConfig) {
  const { dll_entry, bundle_public_path } = rearguardConfig;

  return general_WP_config(
    envConfig,
    rearguardConfig,
    {
      [dll_entry_name()]: [path.resolve(get_context(), dll_entry)],
    },
    {
      // path - путь куда записываются файлы.
      path: dll_output_path(),
      // publicPath - путь до ресурса с файлами.
      publicPath: bundle_public_path,
      library: dll_entry_name(),
      libraryTarget: "var",
    },
    tsLoader(),
    [
      // ...DllReferencePlugin(true),
      ...DllPlugin(envConfig),
      ...assetsPlugin(envConfig, DLL_BUNDLE_DIR_NAME),
      ...analyze(envConfig),
      ...clean(envConfig, [dll_output_path()]),
      new HashWebpackPlugin(buildStatusConfig, envConfig),
    ],
    {},
  );
}

// tslint:enable:object-literal-sort-keys
