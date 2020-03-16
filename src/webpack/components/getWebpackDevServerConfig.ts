import WebpackDevServer from "webpack-dev-server";
import { RearguardDevConfig } from "../../configs/RearguardDevConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, PUBLIC_DIR_NAME } from "../../const";
import { events, pubSub } from "../../helpers/pubSub";
import { getWebpackStats } from "./getWebpackStats";
import { RearguardConfig } from "../../configs/RearguardConfig";
import path from "path";
import fs from "fs";

export const getWebpackDevServerConfig = async (
  CWD: string,
  isDevelopment: boolean,
): Promise<WebpackDevServer.Configuration & { liveReload: boolean }> => {
  const rearguardLocalConfig = new RearguardDevConfig(CWD);
  const rearguardConfig = new RearguardConfig(CWD);

  const context = rearguardConfig.getContext();
  const entry = rearguardConfig.getEntry();
  const { proxy } = await rearguardLocalConfig.getWDSConfig();

  const pathToEntryPoint = path.resolve(CWD, context, entry);

  let needReloadBrowser = false;

  return {
    http2: true,
    compress: true,
    contentBase: [DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, PUBLIC_DIR_NAME],
    watchContentBase: false,
    useLocalIp: true,
    before(app: any, server: any): void {
      // ! HACK for forcing invalidation of the webpack compiler
      pubSub.on(events.SYNCED, () => {
        if (fs.existsSync(pathToEntryPoint)) {
          let content = fs.readFileSync(pathToEntryPoint, { encoding: "utf-8" });
          const title = "// HACK for forcing invalidation of the webpack compiler, timestamp:";
          const start = content.indexOf(title);

          if (start !== -1) {
            content = content.substring(0, start);
          } else {
            content += `\r`;
          }

          content += `${title} ${Date.now()}`;

          needReloadBrowser = true;
          fs.writeFileSync(pathToEntryPoint, content);
        }
      });

      pubSub.on(events.RELOAD_BROWSER, () => {
        if (needReloadBrowser) {
          server.middleware.waitUntilValid(() => {
            console.log("");
            console.log("[ WDS ][ RELOAD_BROWSER ]");
            console.log("");

            server.sockWrite(server.sockets, "content-changed");
            needReloadBrowser = false;
          });
        }
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
