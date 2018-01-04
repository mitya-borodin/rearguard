import chalk from "chalk";
import * as copy from "copy";
import * as del from "del";
import * as path from "path";
import * as webpack from "webpack";
import { dll_path, output, root, stats as statsConfig } from "../config/target.config";
import buildConfigs from "../config/typescript.config.builder";
import { dev } from "../config/webpack.config";

del([output.path || path.resolve(root, "dist")]).then(() => {
  console.log(chalk.bold.cyan(`=============Clean dist===============`));
  console.log(chalk.bold.cyan(`DELETE: ${output.path || path.resolve(root, "dist")}`));
  console.log(``);

  copy([`${dll_path}/*.js`, `${dll_path}/*.css`], output.path, () => {
    console.log(chalk.bold.cyan(`==============Copy DLL================`));
    console.log(chalk.bold.cyan(`JS: ${dll_path}/*.js`));
    console.log(chalk.bold.cyan(`CSS: ${dll_path}/*.css`));
    console.log(chalk.bold.cyan(`TO: ${output.path}`));
    console.log(``);

    buildConfigs();

    console.log(chalk.bold.cyan(`=================Build================`));
    webpack(dev).run((err: any, stats: any) => {
      if (err) {
        throw new Error(err);
      }

      console.info(stats.toString(statsConfig));
      console.log(chalk.bold.cyan(`=============Build End================`));
      console.log(``);
    });
  });

});
