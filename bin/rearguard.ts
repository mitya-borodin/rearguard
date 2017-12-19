#!/usr/bin/env node

import chalk from "chalk";
import {execSync} from "child_process";
import * as spawn from "cross-spawn";
import {existsSync} from "fs";
import {resolve} from "path";

interface IBoolObj {
  [key: string]: boolean;
}

const [, , action, ...otherArguments] = process.argv;

const alias: { [key: string]: string } = {
  a: "analyze",
  d: "debug",
  i: "isomorphic",
  m: "sourceMap",
  r: "release",
  ss: "staticServer",
  v: "verbose",
};

const {
  onlyServer = false,
  staticServer = false,
  isomorphic = false,
  release = false,
  debug = false,
  analyze = false,
  verbose = false,
  sourceMap = false,
}: IBoolObj = otherArguments.reduce((prevValue: IBoolObj, value: string): IBoolObj => {
  if (value.indexOf("--") === 0) {
    return Object.assign(prevValue, {[value.slice(2, value.length)]: true});
  } else if (value.indexOf("-") === 0) {
    const flag: string = value.slice(1, value.length);

    if (alias.hasOwnProperty(flag)) {
      return Object.assign(prevValue, {[alias[flag]]: true});
    }
  }

  return prevValue;
}, {});

if (action === "start" || action === "build") {
  const launchFile: string = resolve(__dirname, "../src/launchers", `${action}.js`);

  if (existsSync(launchFile)) {
    const globalNodeModules: string = execSync("npm root -g", {encoding: "utf8"}).replace("\n", "");

    if (!existsSync(resolve(globalNodeModules, "rearguard"))) {
      const npm = resolve(globalNodeModules, "../../bin/npm");

      console.log(chalk.bold.cyan(`[REARGUARD][START][INSTALL]: ${npm} i -g rearguard`));
      console.log(chalk.bold.yellowBright("[REARGUARD][INFO]: pending may be continue around" +
        " 60 - 200 seconds, it is normal because npm will be install rearguard."));
      execSync(`${npm} i -g rearguard`, {stdio: "inherit"});
      console.log(chalk.bold.cyan(`[REARGUARD][FINISH][INSTALL]: rearguard was installed here ${npm}/rearguard`));
    }

    const localModeModules: string = resolve(process.cwd(), "node_modules");
    let nodeModulesPath = resolve(globalNodeModules, "rearguard/node_modules");

    if (existsSync(resolve(localModeModules, "rearguard"))) {
      nodeModulesPath = localModeModules;
    }

    if (existsSync(nodeModulesPath)) {
      console.log(chalk.bold.green(`[REARGUARD][NODE_MODULES][FOUND]: ${nodeModulesPath}`));

      process.env.NODE_ENV = !release ? "development" : "production";
      process.env.REARGUARD_LAUNCH_IS_START = action === "start" ? "true" : "false";
      process.env.REARGUARD_LAUNCH_IS_BUILD = action === "build" ? "true" : "false";
      process.env.REARGUARD_NODE_MODULE_PATH = nodeModulesPath;
      process.env.REARGUARD_ISOMORPHIC = isomorphic ? "true" : "false";
      process.env.REARGUARD_ONLY_SERVER = onlyServer ? "true" : "false";
      process.env.REARGUARD_STATIC_SERVER = staticServer ? "true" : "false";
      process.env.REARGUARD_VERBOSE = verbose ? "true" : "false";
      process.env.REARGUARD_ANALYZE = analyze ? "true" : "false";
      process.env.REARGUARD_DEBUG = debug ? "true" : "false";
      process.env.REARGUARD_SOURCE_MAP = sourceMap ? "true" : "false";
      process.env.REARGUARD_ERROR_LOG = "true";

      console.log(chalk.bold.green(`[REARGUARD][LAUNCH]: node ${launchFile}`));

      const result = spawn.sync("node", [launchFile], {stdio: "inherit"});

      if (result.signal) {
        if (result.signal === "SIGKILL") {
          console.log(
            chalk
              .red(
                "The build failed because the process exited too early. " +
                "This probably means the system ran out of memory or someone called " +
                "`kill -9` on the process.",
              ),
          );
          process.exit(1);
        } else if (result.signal === "SIGTERM") {
          console.log(
            chalk
              .bold
              .red(
                "The build failed because the process exited too early. " +
                "Someone might have called `kill` or `killall`, or the system could " +
                "be shutting down.",
              ),
          );

          process.exit(1);
        }

        process.exit(0);
      }

      process.exit(result.status);
    } else {
      console.log(chalk.bold.red(`[REARGUARD][NODE_MODULES][NOT_FOUND]: ${nodeModulesPath}`));
      process.exit(1);
    }
  } else {
    console.log(
      chalk
        .bold
        .red(`I am really sorry but file: ${launchFile}, not found, try check this throw command: ls -la ${launchFile}`),
    );
  }
} else {
  console.log(
    chalk
      .bold
      .red("You should use: rearguard [ react | infernojs ] [ start | build ] [ -ts | -i | -v | -r | -d | -a | -h ]"),
  );
}
