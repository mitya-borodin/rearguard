import chalk from "chalk";
import * as webpack from "webpack";
import { stats as statsConfig } from "../config/target.config";
import { dll } from "../config/webpack.config";

console.log(chalk.bold.cyan(`=================Build DLL================`));
webpack(dll).run((err: any, stats: any) => {
  if (err) {
    throw new Error(err);
  }

  console.info(stats.toString(statsConfig));
  console.log(chalk.bold.cyan(`=============End================`));
});
