// import * as express from "express";
import * as path from "path";
// import { watch_deps_event_emitter } from "../../components/watch_deps";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME } from "../../const";
import { getWebpackStats } from "./getWebpackStats";
import WebpackDevServer from "webpack-dev-server";
import { pubSub, events } from "../../helpers/pubSub";

// tslint:disable:object-literal-sort-keys

export const getWebpackDevServerConfig = async (
  CWD: string,
  isDevelopment: boolean,
): Promise<WebpackDevServer.Configuration & { liveReload: boolean }> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  const { proxy } = await rearguardLocalConfig.getWDSConfig();
  const output = rearguardConfig.getOutput();

  return {
    compress: true,
    contentBase: [path.resolve(CWD, DLL_BUNDLE_DIR_NAME), path.resolve(CWD, LIB_BUNDLE_DIR_NAME)],
    watchContentBase: false,
    before(app: any, server: any): void {
      pubSub.on(events.SYNCED, () => {
        server.middleware.waitUntilValid(() => {
          server.sockWrite(server.sockets, "content-changed");
        });
      });
    },
    historyApiFallback: true,
    hot: isDevelopment,
    liveReload: isDevelopment,
    // ! Should enable with right certificates
    https: false,
    overlay: false,
    proxy,
    publicPath: output.publicPath,
    stats: getWebpackStats(CWD),
  };
};

// tslint:enable:object-literal-sort-keys
