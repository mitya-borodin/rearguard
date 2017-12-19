#!/usr/bin/env node

import chalk from "chalk";
import { execSync } from "child_process";
import * as spawn from "cross-spawn";
import { existsSync } from "fs";
import { resolve } from "path";

interface IBoolObj {
  [key: string]: boolean;
}

const [, , action, ...otherArguments] = process.argv;

const alias: { [key: string]: string } = { d: "debug", r: "release" };

const { release = false, debug = false }: IBoolObj = otherArguments.reduce((prevValue: IBoolObj, value: string): IBoolObj => {
  if (value.indexOf("--") === 0) {
    return Object.assign(prevValue, { [value.slice(2, value.length)]: true });
  } else if (value.indexOf("-") === 0) {
    const flag: string = value.slice(1, value.length);

    if (alias.hasOwnProperty(flag)) {
      return Object.assign(prevValue, { [alias[flag]]: true });
    }
  }

  return prevValue;
}, {});

if (action === "start" || action === "build") {
  const launchFile: string = resolve(__dirname, "../src/launchers", `${action}.js`);

  if (existsSync(launchFile)) {
    const GLOBAL_NODE_MODULES: string = execSync("npm root -g", { encoding: "utf8" }).replace("\n", "");

    if (!existsSync(resolve(GLOBAL_NODE_MODULES, "rearguard"))) {
      const npm = resolve(GLOBAL_NODE_MODULES, "../../bin/npm");

      console.log(chalk.bold.cyan(`=================Rearguard================`));
      console.log(chalk.bold.cyan(`==================Install=================`));
      console.log(chalk.bold.cyan(`LAUNCH: ${npm} i -g rearguard`));
      console.log(chalk.bold.cyan(`INFO: pending may be continue around 60 - 200 seconds, it is normal because npm will be install rearguard.`));

      execSync(`${npm} i -g rearguard`, { stdio: "inherit" });

      console.log(chalk.bold.cyan(`RESULT: rearguard was installed here ${npm}/rearguard`));
      console.log(chalk.bold.cyan(`==========================================`));
    }

    const LOCAL_NODE_MODULES: string = resolve(process.cwd(), "node_modules");
    let NODE_MODULE_PATH = resolve(GLOBAL_NODE_MODULES, "rearguard/node_modules");

    if (existsSync(resolve(LOCAL_NODE_MODULES, "rearguard"))) {
      NODE_MODULE_PATH = LOCAL_NODE_MODULES;
    }

    if (existsSync(NODE_MODULE_PATH)) {
      process.env.REARGUARD_NODE_MODULE_PATH = NODE_MODULE_PATH;
      process.env.REARGUARD_DEBUG = debug ? "true" : "false";
      process.env.REARGUARD_LAUNCH_IS_START = action === "start" ? "true" : "false";
      process.env.REARGUARD_LAUNCH_IS_BUILD = action === "build" ? "true" : "false";
      process.env.NODE_ENV = !release ? "development" : "production";

      console.log(chalk.bold.green(`================Rearguard==============`));
      console.log(chalk.bold.green(`==================Info=================`));
      console.log(chalk.bold.green(`TYPE: ${action}`));
      console.log(chalk.bold.green(`NODE_ENV: ${process.env.NODE_ENV}`));
      console.log(chalk.bold.green(`DEBUG: ${process.env.REARGUARD_DEBUG}`));
      console.log(chalk.bold.green(`NODE_MODULES: ${NODE_MODULE_PATH}`));
      console.log(chalk.bold.green(`LAUNCH: node ${launchFile}`));
      console.log(chalk.bold.green(`=======================================`));

      const result = spawn.sync("node", [launchFile], { stdio: "inherit" });

      if (result.signal) {
        if (result.signal === "SIGKILL") {
          console.log(chalk.red("The build failed because the process exited too early. This probably means the system ran out of memory or someone called `kill -9` on the process."));
          process.exit(1);
        } else if (result.signal === "SIGTERM") {
          console.log(chalk.bold.red("The build failed because the process exited too early. Someone might have called `kill` or `killall`, or the system could be shutting down."));
          process.exit(1);
        }
        process.exit(0);
      }

      process.exit(result.status);
    } else {
      console.log(chalk.bold.red(`[REARGUARD][NODE_MODULES][NOT_FOUND]: ${NODE_MODULE_PATH}`));
      process.exit(1);
    }
  } else {
    console.log(chalk.bold.red(`I am really sorry but file: ${launchFile}, not found, try check this throw command: ls -la ${launchFile}`));
  }
} else {
  console.log(chalk.bold.red("You should use: rearguard [ start | build ] [ -r | -d ]"));
}
