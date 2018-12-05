import * as chokidar from "chokidar";
import * as express from "express";
import * as path from "path";
import { envConfig } from "../../config/env";
import { wdsConfig } from "../../config/wds";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME } from "../../const";
import { get_context } from "../../helpers";
import { rearguardConfig } from "./../../config/rearguard/index";

// tslint:disable:object-literal-sort-keys

let watcher: chokidar.FSWatcher | void;

export function get_WDS_config(): any {
  const { proxy } = wdsConfig;
  const { output } = rearguardConfig;
  const { isDebug } = envConfig;

  return {
    bonjour: true,
    compress: true,
    contentBase: [path.resolve(process.cwd(), DLL_BUNDLE_DIR_NAME), path.resolve(process.cwd(), LIB_BUNDLE_DIR_NAME)],
    watchContentBase: false,
    before(app: express.Application, server: any) {
      if (watcher) {
        watcher.close();
      }

      const files = [
        `${path.resolve(process.cwd(), DLL_BUNDLE_DIR_NAME)}/**/*`,
        `${path.resolve(process.cwd(), LIB_BUNDLE_DIR_NAME)}/**/*`,
      ];
      const options = {
        cwd: process.cwd(),
        depth: 5,
        followSymlinks: false,
        ignoreInitial: true,
      };

      watcher = chokidar.watch(files, options);

      watcher.on("all", () => {
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
    stats: isDebug
      ? "verbose"
      : {
          assets: true,
          colors: true,
          context: get_context(),
          hash: true,
          modules: false,
          performance: false,
          publicPath: true,
          timings: true,
          version: true,
        },
  };
}

// tslint:enable:object-literal-sort-keys
