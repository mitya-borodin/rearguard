import * as express from "express";
import * as path from "path";
import { watch_deps_event_emitter } from "../../components/watch_deps";
import { wdsConfig } from "../../config/wds";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME } from "../../const";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import { IRearguardConfig } from "../../interfaces/config/IRearguardConfig";
import { get_stats } from "./get_stats";

// tslint:disable:object-literal-sort-keys

export function get_WDS_config(envConfig: IEnvConfig, rearguardConfig: IRearguardConfig): any {
  const { proxy } = wdsConfig;
  const { output } = rearguardConfig;

  return {
    bonjour: true,
    compress: true,
    contentBase: [path.resolve(process.cwd(), DLL_BUNDLE_DIR_NAME), path.resolve(process.cwd(), LIB_BUNDLE_DIR_NAME)],
    watchContentBase: false,
    before(app: express.Application, server: any) {
      watch_deps_event_emitter.on("SYNCED", () => {
        server.middleware.waitUntilValid(() => {
          server.sockWrite(server.sockets, "content-changed");
        });
      });
    },
    historyApiFallback: true,
    hot: true,
    https: true,
    open: true,
    overlay: false,
    proxy,
    publicPath: output.publicPath,
    stats: get_stats(envConfig),
  };
}

// tslint:enable:object-literal-sort-keys
