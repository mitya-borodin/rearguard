import chalk from "chalk";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import { initProject } from "../components/init_project";
import { wdsConfig } from "../config/wds";
import { get_WDS_config } from "../webpack/components/get_WDS_config";
import { main_WS_config } from "../webpack/webpack.config.main";

async function wds() {
  await initProject();

  const { host, port } = wdsConfig;
  const server = new WDS(webpack(main_WS_config()), get_WDS_config());

  server.listen(port, host, () => {
    console.log(``);
    console.log(chalk.bold.cyanBright(`[ WDS ][ LAUNCHED ]`));
    console.log(chalk.cyan(`[ LAUNCHED: https://${host}:${port} ]`));
  });
}

wds();
