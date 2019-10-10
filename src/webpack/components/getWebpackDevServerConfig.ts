// import * as express from "express";
import * as path from "path";
// import { watch_deps_event_emitter } from "../../components/watch_deps";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME } from "../../const";
import { getWebpackStats } from "./getWebpackStats";
import WebpackDevServer from "webpack-dev-server";

// tslint:disable:object-literal-sort-keys

export const getWebpackDevServerConfig = async (
  CWD: string,
): Promise<WebpackDevServer.Configuration> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  const { proxy } = await rearguardLocalConfig.getWDSConfig();
  const output = rearguardConfig.getOutput();

  return {
    compress: true,
    contentBase: [path.resolve(CWD, DLL_BUNDLE_DIR_NAME), path.resolve(CWD, LIB_BUNDLE_DIR_NAME)],
    watchContentBase: false,
    // TODO Uncomment, after debugging recompiling queue
    /*     before(app: express.Application, server: any): void {
      watch_deps_event_emitter.on("SYNCED", () => {
        server.middleware.waitUntilValid(() => {
          server.sockWrite(server.sockets, "content-changed");
        });
      });
    }, */
    historyApiFallback: true,
    hot: true,
    https: true,
    overlay: false,
    proxy,
    publicPath: output.publicPath,
    stats: getWebpackStats(CWD),
  };
};

// tslint:enable:object-literal-sort-keys
