import chalk from "chalk";
import {execSync} from "child_process";
import {context, isDebug, nodeModulePath} from "../config/target.config";

export default function typedCSS() {
  console.log(chalk.bold.cyanBright(`[Typed CSS]`.toUpperCase()));
  execSync(
    `node ${nodeModulePath}/typed-css-modules/lib/cli.js ${context} -c`,
    isDebug ? {encoding: "utf8", stdio: "inherit"} : {},
  );
  console.log(``);
}
