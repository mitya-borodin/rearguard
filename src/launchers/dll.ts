import chalk from "chalk";
import * as webpack from "webpack";
import { syncNPM } from "../config/components/syncNPM";
import { stats as statsConfig } from "../config/components/target.config";
import buildConfigs from "../config/components/typescript.config.builder";
import { dll } from "../config/webpack.config";
import setTypingForAllCSSandFiles from "./setTypingForAllCSSandFiles";

async function dllRun() {
  await syncNPM(false);
  await setTypingForAllCSSandFiles();
  await buildConfigs();

  console.log("");
  console.log(chalk.bold.cyanBright(`[Build DLL]`.toUpperCase()));
  webpack(dll).run((err: any, stats: any) => {
    if (err) {
      throw new Error(err);
    }

    console.info(stats.toString(statsConfig));
    console.log(chalk.bold.cyanBright(`[Build DLL End]`.toUpperCase()));
  });
}

dllRun();
