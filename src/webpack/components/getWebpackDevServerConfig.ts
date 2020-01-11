import WebpackDevServer from "webpack-dev-server";
import { RearguardDevConfig } from "../../configs/RearguardDevConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, PUBLIC_DIR_NAME } from "../../const";
import { events, pubSub } from "../../helpers/pubSub";
import { getWebpackStats } from "./getWebpackStats";

export const getWebpackDevServerConfig = async (
  CWD: string,
  isDevelopment: boolean,
): Promise<WebpackDevServer.Configuration & { liveReload: boolean }> => {
  const rearguardLocalConfig = new RearguardDevConfig(CWD);

  const { proxy } = await rearguardLocalConfig.getWDSConfig();

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
    publicPath: "/",
    stats: getWebpackStats(CWD),
    headers: {
      ["Cache-Control"]: "no-transform",
    },
  };
};

// tslint:enable:object-literal-sort-keys
