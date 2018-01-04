import chalk from "chalk";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import { socket, WDSConfig } from "../config/target.config";
import buildConfigs from "../config/typescript.config.builder";
import { dev } from "../config/webpack.config";
import { typedCSS } from "./typedCSS";

console.log(chalk.bold.cyan(`=================Start================`));
buildConfigs();
console.log(chalk.bold.cyan(`=========Compile *.css.d.ts===========`));
typedCSS(true);

const server = new WDS(webpack(dev), WDSConfig);

server.listen(socket.port, socket.host, () => {
  console.log(chalk.bold.cyan(`=================WDS================`));
  console.log(chalk.bold.cyan(`LAUNCHED: https://${socket.host}:${socket.port}`));
  console.log(chalk.bold.cyan(`===========Watch *.css.d.ts=========`));
  typedCSS();
});