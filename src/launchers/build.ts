/* import chalk from "chalk";
import * as copy from "copy";
import * as del from "del";
import * as path from "path";
import * as webpack from "webpack";
import { syncNPM } from "../config/components/syncNPM";
import {
  dll_path,
  output,
  root,
  stats as statsConfig,
} from "../config/components/target.config";
import buildConfigs from "../config/components/typescript.config.builder";
import { main } from "../config/webpack.config";
import setTypingForAllCSSandFiles from "./setTypingForAllCSSandFiles";

del([output.path || path.resolve(root, "dist")]).then(() => {
  console.log(chalk.bold.cyan(`[CLEAN DIST]`));
  console.log(
    chalk.cyan(`[DELETE] ${output.path || path.resolve(root, "dist")}`),
  );
  console.log("");

  copy([`${dll_path}/*.js`, `${dll_path}/*.css`], output.path, async () => {
    console.log("");
    console.log(chalk.bold.cyan(`[ COPY DLL ]`));
    console.log(chalk.cyan(`JS: ${dll_path}/*.js`));
    console.log(chalk.cyan(`CSS: ${dll_path}/*.css`));
    console.log(chalk.cyan(`TO: ${output.path}`));

    await syncNPM(false);
    await setTypingForAllCSSandFiles();
    await buildConfigs();

    console.log(chalk.bold.cyan(`[ BUILD ]`));
    webpack(main).run((err: any, stats: any) => {
      if (err) {
        throw new Error(err);
      }

      console.log("");
      console.info(stats.toString(statsConfig));
      console.log(chalk.bold.cyan(`[ BUILD END ]`));
    });
  });
});
 */
