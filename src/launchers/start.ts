import chalk from "chalk";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import { npmHardSyncStart } from "../config/components/npmHardSync";
import { socket, WDSConfig } from "../config/components/target.config";
import buildConfigs from "../config/components/typescript.config.builder";
import { dev } from "../config/webpack.config";
import setTypingForAllCSSandFiles from "./setTypingForAllCSSandFiles";

async function start() {
  console.log(chalk.bold.cyanBright(`[START]`));
  await npmHardSyncStart();
  await setTypingForAllCSSandFiles();
  await buildConfigs();

  const server = new WDS(webpack(dev), WDSConfig);

  server.listen(socket.port, socket.host, () => {
    console.log(``);
    console.log(chalk.bold.cyanBright(`[WDS][LAUNCHED]`));
    console.log(chalk.cyan(`LAUNCHED: https://${socket.host}:${socket.port}`));
  });
}

start();
