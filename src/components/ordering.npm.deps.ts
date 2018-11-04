import chalk from "chalk";
import { existsSync, readFileSync, writeFileSync } from "fs";
import * as moment from "moment";
import * as path from "path";
import { configFileName } from "../../const";
import { resolveGlobalNodeModules, resolveLocalNodeModules, root, sync_npm_deps } from "./target.config";
// tslint:disable:variable-name

function collect_all_deps(a_deps: string[]): string[] {
  const deps: string[] = [];

  function worker(module_name: string, node_module_path: string) {
    const config_path = path.resolve(node_module_path, configFileName);

    if (existsSync(config_path)) {
      const config = require(config_path);

      if (Array.isArray(config.sync_npm_deps)) {
        if (config.sync_npm_deps.length > 0) {
          if (!deps.includes(module_name)) {
            deps.push(module_name);
          }

          const items = collect_all_deps(config.sync_npm_deps);

          for (const item of items) {
            if (!deps.includes(item)) {
              deps.push(item);
            }
          }

          return true;
        } else {
          if (!deps.includes(module_name)) {
            deps.push(module_name);
          }

          return true;
        }
      } else {
        console.log(
          chalk.red(
            `[ ORDERINNG_NPM_DEPS ][ collect_all_deps ][ ERROR ][ ${configFileName} must have field sync_npm_deps: string[] ]`,
          ),
        );

        process.exit(1);
      }
    } else {
      console.log(
        chalk.red(`[ ORDERINNG_NPM_DEPS ][ collect_all_deps ][ ERROR ][ CONFIG_FILE_DO_NOT_EXIST: ${config_path} ]`),
      );

      process.exit(1);
    }

    return false;
  }

  for (const module_name of a_deps) {
    const global_path = resolveGlobalNodeModules(module_name);

    if (existsSync(global_path)) {
      if (worker(module_name, global_path)) {
        continue;
      }
    } else {
      console.log(
        chalk.red(
          `[ ORDERINNG_NPM_DEPS ][ collect_all_deps ][ ERROR ][ You haven't link in global node_modules ${global_path}; ]`,
        ),
      );

      process.exit(1);
    }

    const local_path = resolveLocalNodeModules(module_name);

    if (existsSync(local_path)) {
      if (worker(module_name, local_path)) {
        continue;
      }
    } else {
      console.log(
        chalk.red(
          `[ ORDERINNG_NPM_DEPS ][ collect_all_deps ][ ERROR ][ You haven't local node_modules ${local_path} ]`,
        ),
      );

      process.exit(1);
    }
  }

  return deps;
}

function calculate_weight_for_module(a_module_name: string, a_weight = 0): number {
  const global_path = resolveGlobalNodeModules(a_module_name);
  const local_path = resolveLocalNodeModules(a_module_name);

  function worker(node_module_path: string, weight: number): number {
    const config_path = path.resolve(node_module_path, configFileName);

    if (existsSync(config_path)) {
      const config = require(config_path);

      if (Array.isArray(config.sync_npm_deps)) {
        if (config.sync_npm_deps.length > 0) {
          weight += config.sync_npm_deps.length;

          for (const module_name of config.sync_npm_deps) {
            weight += calculate_weight_for_module(module_name, 0);
          }

          return weight;
        } else {
          return weight;
        }
      } else {
        console.log(
          chalk.red(
            `[ ORDERINNG_NPM_DEPS ][ calculate_weight_for_module ][ ERROR ][ ${configFileName} must have field sync_npm_deps: string[] ]`,
          ),
        );

        process.exit(1);
      }
    } else {
      console.log(
        chalk.red(
          `[ ORDERINNG_NPM_DEPS ][ calculate_weight_for_module ][ ERROR ][ CONFIG_FILE_DO_NOT_EXIST: ${config_path} ]`,
        ),
      );

      process.exit(1);
    }

    return weight;
  }

  if (existsSync(global_path)) {
    return worker(global_path, a_weight);
  }

  if (existsSync(local_path)) {
    return worker(local_path, a_weight);
  }

  console.log(
    chalk.red(
      `[ ORDERINNG_NPM_DEPS ][ calculate_weight_for_module ][ ERROR ][ You haven't link in local node_modules ${global_path}; ]`,
    ),
  );

  console.log(
    chalk.red(
      `[ ORDERINNG_NPM_DEPS ][ calculate_weight_for_module ][ ERROR ][ You haven't link in global node_modules ${global_path}; ]`,
    ),
  );

  process.exit(1);

  return 0;
}

export async function ordering_npm_deps() {
  console.log(chalk.bold.blue(`============ORDERINNG_NPM_DEPS=========`));
  const startTime = moment();
  console.log(chalk.bold.blue(`[ ORDERINNG_NPM_DEPS ][ RUN ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log("");

  const all_modules = collect_all_deps(sync_npm_deps);
  const module_weight: Array<{ [key: string]: any }> = [];

  for (const dep of all_modules) {
    module_weight.push({ name: dep, weight: calculate_weight_for_module(dep) });
  }

  console.log(chalk.white(`[ ORDERINNG_NPM_DEPS ][ ADDED_ALL_MODULES ]`));

  const modules = module_weight
    .sort((a, b) => {
      return a.weight > b.weight ? 1 : -1;
    })
    .map(({ name }) => name);

  console.log(chalk.white(`[ ORDERINNG_NPM_DEPS ][ SORTED_MODULES ]`));

  const config_path = path.resolve(root, configFileName);

  if (existsSync(config_path)) {
    const config = JSON.parse(readFileSync(config_path, { encoding: "utf8" }));

    config.sync_npm_deps = modules;

    writeFileSync(config_path, JSON.stringify(config, null, 2));

    console.log(chalk.white(`[ ORDERINNG_NPM_DEPS ][ CONFIG_WAS_UPADTED ]`));
    console.log("");
  } else {
    console.log(chalk.red(`[ ORDERINNG_NPM_DEPS ][ ERROR ][ CONFIG_FILE_DO_NOT_EXIST: ${config_path} ]`));

    process.exit(1);
  }

  const endTime = moment();

  console.log(
    chalk.bold.blue(`[ ORDERINNG_NPM_DEPS ][ WORK_TIME ][ ${endTime.diff(startTime, "milliseconds")} ][ millisecond ]`),
  );
  console.log(chalk.bold.blue(`[ ORDERINNG_NPM_DEPS ][ DONE ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log(chalk.bold.blue(`=======================================`));
  console.log("");
}
// tslint:enable:variable-name
