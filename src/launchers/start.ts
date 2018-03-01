import chalk from "chalk";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import {socket, WDSConfig} from "../config/components/target.config";
import buildConfigs from "../config/components/typescript.config.builder";
import {dev} from "../config/webpack.config";
import setTypingForAllCSSandFiles from "./setTypingForAllCSSandFiles";

console.log(chalk.bold.cyanBright(`[START]`));
setTypingForAllCSSandFiles();
buildConfigs();

const server = new WDS(webpack(dev), WDSConfig);

server.listen(socket.port, socket.host, () => {
  console.log(chalk.bold.cyanBright(`[WDS][LAUNCHED]`));
  console.log(chalk.cyan(`LAUNCHED: https://${socket.host}:${socket.port}`));
  console.log(``);
});
