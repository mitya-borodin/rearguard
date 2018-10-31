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

const alias: { [key: string]: string } = {
  d: "debug",
  r: "release",
};

const {
  release = false,
  debug = false,
  dll = false,
  lib = false,
  init = false,
  install = false,
  build = false,
  link = false,
  bootstrap = false, // it is combination of (install, build, link);
  sync = false,
  test = false,
  publish = false,
  patch = false,
  minor = false,
  major = false,
}: IBoolObj = otherArguments.reduce((prevValue: IBoolObj, value: string): IBoolObj => {
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

if (
  action === "wds" ||
  action === "sync_deps" ||
  action === "ordering_npm_deps" ||
  action === "build" ||
  action === "tsc" ||
  action === "monorepo"
) {
  console.log("");

  if (
    action !== "monorepo" &&
    (init || install || build || link || bootstrap || sync || test || publish || patch || minor || major)
  ) {
    console.log(
      chalk.bold.red(
        `I am really sorry but this configuration: "rearguard ${action} [ --init | --install | --build | --link | --bootstrap | --sync | --test | --publish | --patch | --minor | --major ]" is not valid;`,
      ),
    );
    console.log(
      chalk.bold.green(
        `You should use: "rearguard monorepo [ --init | --install | --build | --link | --bootstrap | --sync | --test | --publish | --patch | --minor | --major ]";`,
      ),
    );

    process.exit(1);
  }

  if (action === "monorepo" && (patch || minor || major) && !publish) {
    console.log(
      chalk.bold.red(
        `I am really sorry but this configuration: "rearguard ${action} [ --patch | --minor | --major ]" is not valid without [ --publish ];`,
      ),
    );
    console.log(chalk.bold.green(`You should use: "rearguard monorepo --publish [ --patch | --minor | --major ]";`));

    process.exit(1);
  }

  if (action === "wds" && (dll || lib)) {
    console.log(
      chalk.bold.red(`I am really sorry but this configuration: "rearguard ${action} [ --dll | --lib ]" is not valid;`),
    );
    console.log(chalk.bold.green(`You should use: "rearguard build [ --dll | --lib ]";`));

    process.exit(1);
  }

  if (action === "sync_deps" && release) {
    console.log(
      chalk.bold.red(
        `I am really sorry but this configuration: "rearguard ${action} [ --release | -r | --lib ]" is not valid;`,
      ),
    );
    console.log(chalk.bold.green(`You should use: "rearguard ${action} [ --debug || -d ]";`));

    process.exit(1);
  }

  let launchEntryFile = action;

  if (action === "build" && dll) {
    launchEntryFile = "dll";
  }

  if (action === "build" && lib) {
    launchEntryFile = "lib";
  }

  const launchPath: string = resolve(__dirname, "../src/launchers", `${launchEntryFile}.js`);

  if (existsSync(launchPath)) {
    // Определение глобального node_modules
    const GLOBAL_NODE_MODULES: string = execSync("npm root -g", {
      encoding: "utf8",
    }).replace("\n", "");

    if (!existsSync(resolve(GLOBAL_NODE_MODULES, "rearguard"))) {
      const npm = resolve(GLOBAL_NODE_MODULES, "../../bin/npm");

      console.log(chalk.bold.cyanBright(`=================Rearguard================`));
      console.log(chalk.bold.cyan(`==================Install=================`));
      console.log(chalk.cyan(`LAUNCH: ${npm} i -g rearguard`));
      console.log(
        chalk.bold.cyan(
          `INFO: pending may be continue around 60 - 200 seconds, it is normal because npm will be install rearguard.`,
        ),
      );

      execSync(`${npm} i -g rearguard`, { encoding: "utf8", stdio: "inherit" });

      console.log(chalk.bold.cyan(`RESULT: rearguard was installed here ${npm}/rearguard`));
      console.log(chalk.bold.cyan(`==========================================`));
    }
    // Определение локального node_modules
    const LOCAL_NODE_MODULES: string = resolve(process.cwd(), "node_modules");
    let NODE_MODULE_PATH = resolve(GLOBAL_NODE_MODULES, "rearguard/node_modules");

    if (existsSync(resolve(LOCAL_NODE_MODULES, "rearguard"))) {
      NODE_MODULE_PATH = LOCAL_NODE_MODULES;
    }

    if (existsSync(NODE_MODULE_PATH)) {
      process.env.REARGUARD_GLOBAL_NODE_MODULES_PATH = GLOBAL_NODE_MODULES;
      process.env.REARGUARD_LOCAL_NODE_MODULE_PATH = LOCAL_NODE_MODULES;
      process.env.REARGUARD_NODE_MODULE_PATH = NODE_MODULE_PATH;

      // Варианты запуска
      process.env.REARGUARD_LAUNCH_IS_WDS = action === "wds" ? "true" : "false";
      process.env.REARGUARD_LAUNCH_IS_SYNC_DEPS = action === "sync_deps" ? "true" : "false";
      process.env.REARGUARD_LAUNCH_IS_BUILD = action === "build" ? "true" : "false";

      // Параметры запуска
      process.env.NODE_ENV = !release ? "development" : "production";
      process.env.REARGUARD_DEBUG = debug ? "true" : "false";
      process.env.REARGUARD_LIB = lib ? "true" : "false";
      process.env.REARGUARD_DLL = dll ? "true" : "false";

      // MONO_REPO
      process.env.REARGUARD_MONO_INIT = init ? "true" : "false";
      process.env.REARGUARD_MONO_INSTALL = install ? "true" : "false";
      process.env.REARGUARD_MONO_BUILD = build ? "true" : "false";
      process.env.REARGUARD_MONO_LINK = link ? "true" : "false";
      process.env.REARGUARD_MONO_BOOTSTRAP = bootstrap ? "true" : "false";
      process.env.REARGUARD_MONO_SYNC = sync ? "true" : "false";
      process.env.REARGUARD_MONO_TEST = test ? "true" : "false";
      process.env.REARGUARD_MONO_PUBLISH = publish ? "true" : "false";
      process.env.REARGUARD_MONO_PUBLISH_PATH = publish && patch ? "true" : "false";
      process.env.REARGUARD_MONO_PUBLISH_MINOR = publish && minor ? "true" : "false";
      process.env.REARGUARD_MONO_PUBLISH_MAJOR = publish && major ? "true" : "false";

      // Логирование параметров запуска.
      console.log(chalk.bold.blueBright(`================Rearguard==============`));
      console.log(chalk.bold.greenBright(`==================Info=================`));
      console.log(chalk.bold.greenBright(`NODE_MODULES: ${NODE_MODULE_PATH}`));
      console.log(chalk.bold.greenBright(`ACTION: ${action}`));
      console.log(chalk.bold.greenBright(`NODE_ENV: ${process.env.NODE_ENV}`));
      console.log(chalk.bold.greenBright(`DEBUG: ${process.env.REARGUARD_DEBUG}`));
      console.log(chalk.bold.greenBright(`DLL: ${process.env.REARGUARD_DLL}`));
      console.log(chalk.bold.greenBright(`LAUNCH: node ${launchPath}`));
      console.log(chalk.bold.greenBright(`=======================================`));
      console.log(``);

      const result = spawn.sync("node", [launchPath], {
        encoding: "utf8",
        stdio: "inherit",
      });

      if (result.signal) {
        if (result.signal === "SIGKILL") {
          console.log(
            chalk.red(
              "The build failed because the process exited too early. This probably means the system ran out of memory or someone called `kill -9` on the process.",
            ),
          );

          process.exit(1);
        } else if (result.signal === "SIGTERM") {
          console.log(
            chalk.bold.red(
              "The build failed because the process exited too early. Someone might have called `kill` or `killall`, or the system could be shutting down.",
            ),
          );

          process.exit(1);
        }

        process.exit(0);
      }

      process.exit(result.status);
    } else {
      console.log(chalk.bold.red(`[ REARGUARD ][ NODE_MODULES ][ NOT_FOUND ]: ${NODE_MODULE_PATH}`));

      process.exit(1);
    }
  } else {
    console.log(
      chalk.bold.red(
        `I am really sorry but file: ${launchPath}, not found, try check this throw command: "ls -la ${launchPath}";`,
      ),
    );
  }
} else {
  console.log(
    chalk.bold.green(
      "You should use: rearguard [ wds | sync_deps | build ] [ -r | --release | -d | --debug | --dll ];",
    ),
  );
}
