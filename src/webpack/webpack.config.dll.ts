import * as path from "path";
import { envConfig } from "../config/env";
import { rearguardConfig } from "../config/rearguard";
import { DLL_BUNDLE_DIR_NAME } from "../const";
import { dll_entry_name, get_context } from "../helpers";
import { analyze, assetsPlugin, clean, DllPlugin, DllReferencePlugin } from "./components/js.plugins";
import tsLoader from "./components/ts.loaders";
import { general_WP_config } from "./webpack.config.common";

// tslint:disable:object-literal-sort-keys

export function dll_WP_config() {
  const { dll_entry, bundle_public_path, dll_output_path } = rearguardConfig;
  const { isDevelopment, isDebug } = envConfig;

  return general_WP_config(
    {
      [dll_entry_name()]: [path.resolve(get_context(), dll_entry)],
    },
    {
      // path - путь куда записываются файлы.
      path: dll_output_path,
      // publicPath - путь до ресурса с файлами.
      publicPath: bundle_public_path,
      library: dll_entry_name(),
      libraryTarget: "var",
    },
    tsLoader(),
    [
      ...DllReferencePlugin(true),
      ...DllPlugin(),
      ...assetsPlugin(DLL_BUNDLE_DIR_NAME),
      ...analyze(),
      ...clean([dll_output_path]),
    ],
    {},
  );
}

// tslint:enable:object-literal-sort-keys
