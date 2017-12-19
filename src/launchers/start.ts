import * as chalk from "chalk";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import { host, port, socket, WDSConfig } from "../config/target.config";
import buildConfigs from "../config/typescript.config.builder";
import webpackConfig from "../config/webpack.config";
import { typedCSS } from "./typedCSS";

console.log(chalk.bold.cyan(`=================Start================`));
console.log(chalk.bold.cyan(`=======Build typescript config========`));
buildConfigs();

console.log(chalk.bold.cyan(`=========Compile *.css.d.ts===========`));
typedCSS(true);

const server = new WDS(webpack(webpackConfig), WDSConfig);

server.listen(port, host, () => {
  console.log(chalk.bold.cyan(`=================WDS================`));
  console.log(chalk.bold.cyan(`LAUNCHED: ${socket}`));

  console.log(chalk.bold.cyan(`===========Watch *.css.d.ts=========`));
  typedCSS();
});
