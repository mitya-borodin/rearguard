import { buildStatusConfig } from "../config/buildStatus";
import { DIST_DIR_NAME } from "../const";
import { IEnvConfig } from "../interfaces/config/IEnvConfig";
import { IRearguardConfig } from "../interfaces/config/IRearguardConfig";
import entry from "./components/entry";
import {
  analyze,
  clean,
  DllReferencePlugin,
  HashWebpackPlugin,
  HMR,
  htmlWebpackPlugin,
} from "./components/js.plugins";
import tsLoader from "./components/ts.loaders";
import { general_WP_config } from "./webpack.config.common";

// tslint:disable:object-literal-sort-keys

export function main_WS_config(envConfig: IEnvConfig, rearguardConfig: IRearguardConfig) {
  const { output } = rearguardConfig;

  return general_WP_config(
    envConfig,
    rearguardConfig,
    entry(),
    {
      // path - путь куда записываются файлы.
      path: output.path,
      // publicPath - путь до ресурса с файлами.
      publicPath: output.publicPath,
    },
    tsLoader(),
    [
      ...clean(envConfig, [DIST_DIR_NAME]),
      ...DllReferencePlugin(envConfig, rearguardConfig),
      ...HMR(envConfig),
      ...htmlWebpackPlugin(envConfig, rearguardConfig),
      ...analyze(envConfig),
      new HashWebpackPlugin(buildStatusConfig, envConfig),
    ],
    {},
  );
}

// tslint:enable:object-literal-sort-keys
