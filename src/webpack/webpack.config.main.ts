import { envConfig } from "../config/env";
import { rearguardConfig } from "../config/rearguard";
import { DIST_DIR_NAME } from "../const";
import entry from "./components/entry";
import { analyze, clean, DllReferencePlugin, HMR, htmlWebpackPlugin, workboxPlugin } from "./components/js.plugins";
import tsLoader from "./components/ts.loaders";
import { general_WP_config } from "./webpack.config.common";

// tslint:disable:object-literal-sort-keys

export function main_WS_config() {
  const { output } = rearguardConfig;
  const { isDevelopment, isDebug } = envConfig;

  return general_WP_config(
    entry(),
    {
      // path - путь куда записываются файлы.
      path: output.path,
      // publicPath - путь до ресурса с файлами.
      publicPath: output.publicPath,
    },
    tsLoader(),
    [
      ...DllReferencePlugin(),
      ...HMR(),
      ...workboxPlugin(),
      ...htmlWebpackPlugin(),
      ...analyze(),
      ...clean([DIST_DIR_NAME]),
    ],
    {},
  );
}

// tslint:enable:object-literal-sort-keys
