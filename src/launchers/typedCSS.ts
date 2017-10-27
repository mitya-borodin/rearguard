import chalk from "chalk";
import {execSync} from "child_process";
import * as chokidar from "chokidar";
import * as fs from "fs";
import * as DtsCreator from "typed-css-modules";
import {context, isTS, nodeModulePath} from "../config/target.config";

export default async function typedCSS(forceBuild = false) {
  if (forceBuild && isTS) {
    execSync(`node ${nodeModulePath}/typed-css-modules/lib/cli.js ${context} -c`, {encoding: "utf8"});
  } else if (isTS) {
    const creator = new DtsCreator({
      camelCase: true,
      rootDir: process.cwd(),
      searchDir: context,
    });
    const watcher = chokidar.watch([`${context}/**/*.css`], {ignoreInitial: true});

    watcher.on("change", async (filePath) => {
      const content = await creator.create(filePath, fs.readFileSync(filePath, {encoding: "utf-8"}));
      await content.writeFile();

      console.log(chalk.bold.magenta(`[REARGUARD][TYPED_CSS][FROM: ${filePath}]`));
    });

    console.log(chalk.bold.magenta(`[REARGUARD][TYPED_CSS][WATCH_CSS]`));
  }
}
