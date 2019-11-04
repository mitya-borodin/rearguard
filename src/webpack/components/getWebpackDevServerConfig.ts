import WebpackDevServer from "webpack-dev-server";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, PUBLIC_DIR_NAME } from "../../const";
import { events, pubSub } from "../../helpers/pubSub";
import { getWebpackStats } from "./getWebpackStats";

export const getWebpackDevServerConfig = async (
  CWD: string,
  isDevelopment: boolean,
): Promise<WebpackDevServer.Configuration & { liveReload: boolean }> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  const { proxy } = await rearguardLocalConfig.getWDSConfig();
  const output = rearguardConfig.getOutput();

  return {
    http2: true,
    compress: true,
    contentBase: [DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, PUBLIC_DIR_NAME],
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
    overlay: false,
    proxy,
    publicPath: output.publicPath,
    stats: getWebpackStats(CWD),
    headers: {
      ["Cache-Control"]: "no-transform",
    },
  };
};

// tslint:enable:object-literal-sort-keys
