import { EventEmitter } from "@borodindmitriy/isomorphic";
import chalk from "chalk";
import * as chokidar from "chokidar";
import { existsSync } from "fs";
import * as path from "path";
import { BuildStatusConfig } from "../config/buildStatus/BuildStatusConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, LIB_DIR_NAME, NON_VERSIONABLE_CONFIG_FILE_NAME } from "../const";
import { IEnvConfig } from "../interfaces/config/IEnvConfig";
import { IRearguardConfig } from "../interfaces/config/IRearguardConfig";
import { copy_bundles } from "./project_deps/copy_bundles";
import { delete_bundles } from "./project_deps/delete_bundles";
import { ordering_project_deps } from "./project_deps/ordering_project_deps";
import { sync_with_linked_modules } from "./project_deps/sync_with_linked_modules";

// tslint:disable:variable-name

let global_modules_watcher: chokidar.FSWatcher | void;
let local_modules_watcher: chokidar.FSWatcher | void;
let sync_project_deps: string | void;

export const watch_deps_event_emitter = new EventEmitter();

async function doSync(envConfig: IEnvConfig, rearguardConfig: IRearguardConfig) {
  console.log(chalk.bold.yellow(`[ WATCH ][ DO_SYNC ][ START ]`));
  console.log("");

  const cur_sync_project_deps = rearguardConfig.sync_project_deps.join(", ");

  if (sync_project_deps !== cur_sync_project_deps) {
    return watch_deps(envConfig, rearguardConfig);
  }

  await ordering_project_deps(envConfig);
  await sync_with_linked_modules(envConfig);

  if (rearguardConfig.is_application || rearguardConfig.has_dll || rearguardConfig.has_browser_lib) {
    await delete_bundles(envConfig, rearguardConfig);
    await copy_bundles(envConfig);
  }

  console.log(chalk.bold.yellow(`[ WATCH ][ DO_SYNC ][ END ]`));
  console.log("");
}

export async function watch_deps(envConfig: IEnvConfig, rearguardConfig: IRearguardConfig): Promise<() => void> {
  console.log(chalk.bold.yellow(`[ WATCH ][ INIT ]`));
  console.log("");

  sync_project_deps = rearguardConfig.sync_project_deps.join(", ");

  if (global_modules_watcher) {
    global_modules_watcher.close();
  }
  if (local_modules_watcher) {
    local_modules_watcher.close();
  }

  let global_modules: any[] = [];
  let local_modules = [];

  /////////////////////
  //
  // * Проверка на существование модулей;
  // * Составление списка модулей;
  //
  /////////////////////

  for (const name of rearguardConfig.sync_project_deps) {
    const global_path = envConfig.resolveGlobalModule(name);
    const local_path = envConfig.resolveLocalModule(name);

    if (existsSync(global_path)) {
      console.log(chalk.white(`[ WATCH ][ GLOBAL_MODULE: ${global_path} ]`));

      global_modules.push(path.resolve(global_path, NON_VERSIONABLE_CONFIG_FILE_NAME));
    } else if (existsSync(local_path)) {
      console.log(chalk.bold.yellow(`[ WATCH ][ LOCAL_MODULE: ${local_path} ]`));

      local_modules.push(path.resolve(local_path, LIB_DIR_NAME, "**/*"));
      local_modules.push(path.resolve(local_path, DLL_BUNDLE_DIR_NAME, "**/*"));
      local_modules.push(path.resolve(local_path, LIB_BUNDLE_DIR_NAME, "**/*"));
    } else {
      console.log(
        chalk.red(
          `[ ERROR ]` +
            `[ You haven't link in global node_modules ${global_path} or local node_modules ${local_path} ]`,
        ),
      );
      console.log(chalk.red(`[ ERROR ]` + `[ You need install ${name} module or link to global node_modules ]`));

      process.exit(1);
    }
  }

  console.log("");
  // END

  const options = {
    cwd: process.cwd(),
    followSymlinks: false,
    ignoreInitial: true,
  };

  if (local_modules.length > 0) {
    local_modules_watcher = chokidar.watch(local_modules, options);

    await new Promise((resolve, reject) => {
      if (local_modules_watcher) {
        local_modules_watcher.on("ready", resolve);
      } else {
        reject("[ WATCH ][ ERROR ][ WATCHRE NOT FOUND ]");
      }
    });

    local_modules_watcher.on("all", async (type: string, watched_file: string) => {
      await doSync(envConfig, rearguardConfig);

      watch_deps_event_emitter.emit("SYNCED");
    });
  }

  if (global_modules.length > 0) {
    global_modules_watcher = chokidar.watch(global_modules, options);

    await new Promise((resolve, reject) => {
      if (global_modules_watcher) {
        global_modules_watcher.on("ready", resolve);
      } else {
        reject("[ WATCH ][ ERROR ][ WATCHRE NOT FOUND ]");
      }
    });

    global_modules_watcher.on("all", async (type: string, watched_file: string) => {
      const { status } = new BuildStatusConfig(watched_file);

      if (status === "done") {
        await doSync(envConfig, rearguardConfig);

        watch_deps_event_emitter.emit("SYNCED");
      }
    });
  }

  console.log(chalk.bold.yellow(`[ WATCH ][ READY ]`));
  console.log("");

  return () => {
    console.log(chalk.bold.red(`[ WATCH ][ DESTROY ]`));
    console.log("");

    if (global_modules_watcher) {
      global_modules_watcher.close();
      global_modules_watcher = undefined;
    }
    if (local_modules_watcher) {
      local_modules_watcher.close();
      local_modules_watcher = undefined;
    }

    sync_project_deps = undefined;

    global_modules = [];
    local_modules = [];
  };
}

// tslint:enable:variable-name