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
  both = false,
  debug = false,

  // mode
  project = false,
  dll = false,
  node_lib = false,
  ui_lib = false,
  load_on_demand = false,

  // monorepo
  init = false,
  clear = false,
  install = false,
  build = false,
  link = false,
  bootstrap = false, // it is combination of (clear, install, build, link);
  test = false,
  publish = false, // work with (--patch, --minor, --major)
  patch = false,
  minor = false,
  major = false,

  // state
  force = false,
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
// tslint:disable:max-line-length

if (
  action === "init" ||
  action === "wds" ||
  action === "watch_deps_for_node_dev" ||
  action === "build_node_server" ||
  action === "build" ||
  action === "monorepo"
) {
  console.log("");

  if (action === "init") {
    if (!(project || dll || ui_lib || node_lib)) {
      console.log(
        chalk.bold.green(
          `You should use: "rearguard init [ --project | --dll | --ui_lib | --node_lib | --load_on_demand | --force ]";`,
        ),
      );

      process.exit(1);
    }
  } else {
    if (load_on_demand) {
      console.log(
        chalk.bold.red(
          `You should use: "rearguard init [ --project | --dll | --ui_lib | --node_lib | --load_on_demand | --force ]";`,
        ),
      );

      process.exit(1);
    }
    if (
      action !== "monorepo" &&
      (init || install || build || link || bootstrap || clear || test || publish || patch || minor || major)
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

    if (action === "monorepo" && !publish && (patch || minor || major)) {
      console.log(
        chalk.bold.red(
          `I am really sorry but this configuration: "rearguard ${action} [ --patch | --minor | --major ]" is not valid without [ --publish ];`,
        ),
      );
      console.log(chalk.bold.green(`You should use: "rearguard monorepo --publish [ --patch | --minor | --major ]";`));

      process.exit(1);
    }

    if (action !== "build" && (dll || node_lib || ui_lib || project || both)) {
      console.log(
        chalk.bold.red(
          `I am really sorry but this configuration: "rearguard ${action} [ --dll | --node_lib | --ui_lib | --project ]" is not valid;`,
        ),
      );
      console.log(chalk.bold.green(`You should use: "rearguard ${action} [ --debug | -d ]";`));

      process.exit(1);
    }

    if (action === "build" && both && release) {
      console.log(
        chalk.bold.red(
          `I am really sorry but this configuration: "rearguard ${action} --both [ --release | -r ]" is not correct;`,
        ),
      );
      console.log(
        chalk.bold.green(`You should use: "rearguard ${action} [ --release | -r ]" or "rearguard ${action} --both";`),
      );

      process.exit(1);
    }
  }

  const launchPath: string = resolve(__dirname, "../src/actions", `${action}.js`);

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
      // Это директория глобального node_modules
      process.env.REARGUARD_GLOBAL_NODE_MODULES_PATH = GLOBAL_NODE_MODULES;
      // Это директория node_modules относительно CWD
      process.env.REARGUARD_LOCAL_NODE_MODULE_PATH = LOCAL_NODE_MODULES;
      // Это директория node_modules внутри пакета readguard, где находтся все dev deps
      process.env.REARGUARD_DEV_NODE_MODULE_PATH = NODE_MODULE_PATH;

      // Варианты запуска
      process.env.REARGUARD_LAUNCH_IS_INIT = action === "init" ? "true" : "false";
      process.env.REARGUARD_LAUNCH_IS_WDS = action === "wds" ? "true" : "false";
      process.env.REARGUARD_LAUNCH_IS_WDND = action === "watch_deps_for_node_dev" ? "true" : "false";
      process.env.REARGUARD_LAUNCH_IS_BUILD_NODE_SERVER = action === "build_node_server" ? "true" : "false";
      process.env.REARGUARD_LAUNCH_IS_BUILD = action === "build" ? "true" : "false";
      process.env.REARGUARD_LAUNCH_MONOREP = action === "monorepo" ? "true" : "false";

      // Параметры запуска
      process.env.NODE_ENV = !release ? "development" : "production";
      process.env.REARGUARD_BUILD_BOTH = both ? "true" : "false";
      process.env.REARGUARD_DEBUG = debug ? "true" : "false";
      process.env.REARGUARD_IS_PROJECT = project ? "true" : "false";
      process.env.REARGUARD_DLL = dll ? "true" : "false";
      process.env.REARGUARD_NODE_LIB = node_lib ? "true" : "false";
      process.env.REARGUARD_UI_LIB = ui_lib ? "true" : "false";
      process.env.REARGUARD_LOAD_ON_DEMAND = load_on_demand ? "true" : "false";

      // Состояние запуска
      process.env.REARGUARD_FORCE = force ? "true" : "false";

      // MONO_REPO
      process.env.REARGUARD_MONO_INIT = init ? "true" : "false";
      process.env.REARGUARD_MONO_CLEAR = clear ? "true" : "false";
      process.env.REARGUARD_MONO_INSTALL = install ? "true" : "false";
      process.env.REARGUARD_MONO_BUILD = build ? "true" : "false";
      process.env.REARGUARD_MONO_LINK = link ? "true" : "false";
      process.env.REARGUARD_MONO_BOOTSTRAP = bootstrap ? "true" : "false";
      process.env.REARGUARD_MONO_TEST = test ? "true" : "false";
      process.env.REARGUARD_MONO_PUBLISH = publish ? "true" : "false";
      process.env.REARGUARD_MONO_PUBLISH_PATH = publish && patch && !(minor || major) ? "true" : "false";
      process.env.REARGUARD_MONO_PUBLISH_MINOR = publish && minor && !major ? "true" : "false";
      process.env.REARGUARD_MONO_PUBLISH_MAJOR = publish && major ? "true" : "false";

      // Логирование параметров запуска.
      console.log(chalk.bold.blueBright(`================Rearguard==============`));
      console.log(chalk.bold.greenBright(`==================Info=================`));
      console.log(chalk.bold.greenBright(`NODE_MODULES: ${NODE_MODULE_PATH}`));
      console.log(chalk.bold.greenBright(`ACTION: ${action}`));
      console.log(chalk.bold.greenBright(`NODE_ENV: ${process.env.NODE_ENV}`));
      console.log(chalk.bold.greenBright(`DEBUG: ${process.env.REARGUARD_DEBUG}`));
      console.log(chalk.bold.greenBright(`DLL: ${process.env.REARGUARD_DLL}`));
      console.log(chalk.bold.greenBright(`NODE_LIB: ${process.env.REARGUARD_NODE_LIB}`));
      console.log(chalk.bold.greenBright(`UI_LIB: ${process.env.REARGUARD_UI_LIB}`));
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
      "You should use: rearguard [ init | wds | build | monorepo ] [ -r | --release | -d | --debug | --dll ];",
    ),
  );
}

// tslint:enable:max-line-length
