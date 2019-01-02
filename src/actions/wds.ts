import chalk from "chalk";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import { initProject } from "../components/init_project";
import { install_declared_deps } from "../components/project_deps/install_declared_deps";
import { watch_deps, watch_deps_event_emitter } from "../components/watch_deps";
import { wdsConfig } from "../config/wds";
import { get_WDS_config } from "../webpack/components/get_WDS_config";
import { main_WS_config } from "../webpack/webpack.config.main";

async function wds() {
  await initProject();

  watch_deps();
  const { host, port } = wdsConfig;
  const server: any = new WDS(webpack(main_WS_config()), get_WDS_config());

  server.listen(port, host, () => {
    console.log(``);
    console.log(chalk.bold.cyanBright(`[ WDS ][ LAUNCHED ]`));
    console.log(chalk.cyan(`[ LAUNCHED: https://${host}:${port} ]`));

    watch_deps_event_emitter.on("SYNCED", () => {
      server.middleware.invalidate();
    });
  });
}

wds();
