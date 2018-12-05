import chalk from "chalk";
import * as chokidar from "chokidar";
import * as path from "path";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import { initProject } from "../components/init_project";
import { wdsConfig } from "../config/wds";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME } from "../const";
import { get_WDS_config } from "../webpack/components/get_WDS_config";
import { main_WS_config } from "../webpack/webpack.config.main";

let watcher: chokidar.FSWatcher | void;

async function wds() {
  await initProject();

  const { host, port } = wdsConfig;
  const server: any = new WDS(webpack(main_WS_config()), get_WDS_config());

  server.listen(port, host, () => {
    console.log(``);
    console.log(chalk.bold.cyanBright(`[ WDS ][ LAUNCHED ]`));
    console.log(chalk.cyan(`[ LAUNCHED: https://${host}:${port} ]`));

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
      server.middleware.invalidate();
    });
  });
}

wds();
