import chalk from "chalk";
import * as copy from "copy";
import * as del from "del";
import * as path from "path";
import * as webpack from "webpack";
import { dll_path, output, root, stats as statsConfig } from "../config/target.config";
import buildConfigs from "../config/typescript.config.builder";
import { dev } from "../config/webpack.config";
import typedCSS from "./typedCSS";

del([output.path || path.resolve(root, "dist")]).then(() => {
  console.log(chalk.bold.cyan(`[Clean dist]`.toUpperCase()));
  console.log(chalk.cyan(`DELETE: ${output.path || path.resolve(root, "dist")}`));
  console.log(``);

  copy([`${dll_path}/*.js`, `${dll_path}/*.css`], output.path, () => {
    console.log(chalk.bold.cyan(`[Copy DLL]`.toUpperCase()));
    console.log(chalk.cyan(`JS: ${dll_path}/*.js`));
    console.log(chalk.cyan(`CSS: ${dll_path}/*.css`));
    console.log(chalk.cyan(`TO: ${output.path}`));
    console.log(``);

    typedCSS();
    buildConfigs();

    console.log(chalk.bold.cyan(`[Build]`.toUpperCase()));
    webpack(dev).run((err: any, stats: any) => {
      if (err) {
        throw new Error(err);
      }

      console.info(stats.toString(statsConfig));
      console.log(chalk.bold.cyan(`[Build End]`.toUpperCase()));
      console.log(``);
    });
  });

});
