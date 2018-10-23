import chalk from "chalk";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import { css_typing_builder } from "../config/components/css.typing.builder";
import { sync_npm_deps } from "../config/components/sync.npm.deps";
import { socket, WDSConfig } from "../config/components/target.config";
import { ts_tsLint_config_builder } from "../config/components/ts.tsLint.config.builder";
import { main as main_WS_config } from "../config/webpack.config";

async function wds() {
  console.log(chalk.bold.cyanBright(`[ WDS ]`));

  await sync_npm_deps();
  await ts_tsLint_config_builder();
  await css_typing_builder();

  const server = new WDS(webpack(main_WS_config), WDSConfig);

  server.listen(socket.port, socket.host, () => {
    console.log(``);
    console.log(chalk.bold.cyanBright(`[ WDS ][ LAUNCHED ]`));
    console.log(
      chalk.cyan(`[ LAUNCHED: https://${socket.host}:${socket.port} ]`),
    );
  });
}

wds();
