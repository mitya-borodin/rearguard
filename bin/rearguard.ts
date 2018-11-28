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

  // mode
  project = false,
  dll = false,
  node_lib = false,
  ui_lib = false,

  // monorepo
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

/**
 * Синхронизация зависимотей - процедура копирования dll_bundle, lib_bundle в соответсвующие директории проекта.
 *                             Копирование происходит как из локально установленных так из слинкованных в глобальный node_modules,
 *                             если пакет слинкован в глобальной node_modules, то копируется указанное в (package.json).files
 *                             после чего уже из локального node_moduled копируются dll_bundle, lib_bundle, если пакет собран как node_lib
 *                             то в нем присутствует директрия lib и точка входа в пакет указана в полях (package.json).main, (package.json).types, (package.json).module;
 *                             После того как файлы доставлены, то сортируется список зависимостей от независимых до зависимых, эта информация позволяет строить правильный index.html;
 * Синхронизация нужна для:
 * 1) Копирование необходимых файлов в целевой проект
 * 2) Для получения информации по которой составляется index.html
 * 3) Для получения информации по которой составляется dynamic_modules.ts, в котором указаны имена модулей в соотвествии с путем до js файла.
 * Пример: export const page_product_detail = "/page_product_detail/page_product_detail.js?3dwq3e2"
 * Использование: сачать этот модуль при помощи SystemJS и воспользоваться его кодом.
 *
 *
 * Таким образом для сборки зависимостей не используется webpack, для реализации code spliting не используется webpack;
 * Следовательно проект может быть размером 100 GB но скачиваться будут модули по кусочкам, и собираться модули будут тоже по кусочкам.
 * Кусочки можно будет разрабатывать на слабеньких компьютерах с минимальным погружением в предметную область,
 * это очень хорошо для разработчиков, управляющих проектом, владельцев компаний.
 */

/**
 * В каждом сценарии запускается синхронизация зависимостей из node_modules как локального так и глобального;
 * WDS - запускается webpack-dev-server, из точки входа без экспортов { entry: "index.tsx" };
 * build - запускается webpack для сборки проекта из точки входа без экспорторв { entry: "index.tsx" };
 * build --dll - запускается webpack для сборки dll bundle, который включает внешние зависимости (react, mobx, и так далее) из точки входа { dll_entry: "vendors.ts" };
 *               на выходе получаем dll_bundle/%project_name%/dll_%project_name%.js и dll_bundle/%project_name%/manifest.json;
 * build --ui_lib - запускается webpack для сборки библиотеки которая будет подключена в бразурер через глобальную перменную, из точки входа { lib_entry: "lib_exports.ts" }
 *                  на выходе получаем lib/*.d.ts, и lib_bundle/%project_name%/lib_%project_name%.js
 * build --node_lib - запускается tsc (typescript compile), и компилирует файлы из src в lib, на выходе получаем lib/{*.d.ts, *.js} файлы
 *                    если указан флаг --ui_lib, то отключается генерация .d.ts файлов, так как они будут сгенерированны в процессе работы webpack;
 * build --dll --ui_lib --node_lib  - будут задействованны { entry: "index.tsx", dll_entry: "vendors.ts", lib_entry: "lib_exports.ts" }, если какая то точка отствует,
 *                                    то будет показано уведомление и секция обработки будет пропущена.
 * init - Закопускает набор служебных скриптов, для инициализации проекта и синхронизации зависимостей.
 */

if (action === "init" || action === "wds" || action === "build" || action === "monorepo") {
  console.log("");

  if (action === "init") {
    if (!(project || dll || ui_lib || node_lib)) {
      console.log(chalk.bold.green(`You should use: "rearguard init --project  [ --dll | --force ]";`));
      console.log(chalk.bold.green(`Or: "rearguard init --dll | --ui_lib | --node_lib | --force";`));

      process.exit(1);
    }

    if (project && (ui_lib || node_lib)) {
      console.log(
        chalk.bold.red(
          `I am really sorry but this configuration: "rearguard init --project [ --ui_lib | --node_lib ] is not valid;`,
        ),
      );

      console.log(chalk.bold.green(`You should use: "rearguard init --project | [ --dll | --force ]";`));

      process.exit(1);
    }
  } else {
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

    if (action === "monorepo" && !publish && (patch || minor || major)) {
      console.log(
        chalk.bold.red(
          `I am really sorry but this configuration: "rearguard ${action} [ --patch | --minor | --major ]" is not valid without [ --publish ];`,
        ),
      );
      console.log(chalk.bold.green(`You should use: "rearguard monorepo --publish [ --patch | --minor | --major ]";`));

      process.exit(1);
    }

    if (action !== "build" && (dll || node_lib || ui_lib)) {
      console.log(
        chalk.bold.red(
          `I am really sorry but this configuration: "rearguard ${action} [ --dll | --node_lib | --ui_lib ]" is not valid;`,
        ),
      );
      console.log(chalk.bold.green(`You should use: "rearguard ${action} [ --debug | -d ]";`));

      process.exit(1);
    }

    if (action !== "wds" && action !== "build" && release) {
      console.log(
        chalk.bold.red(
          `I am really sorry but this configuration: "rearguard ${action} [ --release | -r ]" is not valid;`,
        ),
      );
      console.log(chalk.bold.green(`You should use: "rearguard ${action} [ --debug | -d ]";`));

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
      process.env.REARGUARD_LAUNCH_IS_BUILD = action === "build" ? "true" : "false";
      process.env.REARGUARD_LAUNCH_MONOREP = action === "monorepo" ? "true" : "false";

      // Параметры запуска
      process.env.NODE_ENV = !release ? "development" : "production";
      process.env.REARGUARD_DEBUG = debug ? "true" : "false";
      process.env.REARGUARD_IS_PROJECT = project ? "true" : "false";
      process.env.REARGUARD_DLL = dll ? "true" : "false";
      process.env.REARGUARD_NODE_LIB = node_lib ? "true" : "false";
      process.env.REARGUARD_UI_LIB = ui_lib ? "true" : "false";

      // Состояние запуска
      process.env.REARGUARD_FORCE = force ? "true" : "false";

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
