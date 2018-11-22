import { isArray, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { existsSync, readFileSync, writeFileSync } from "fs";
import * as moment from "moment";
import * as path from "path";
import { envConfig } from "../config/env";
import { rearguardConfig } from "../config/rearguard";
import { RearguardConfig } from "../config/rearguard/RearguardConfig";
// tslint:disable:variable-name

/**
 * Необходимо модифицировать так, чтобы можно было указывать директрию
 * в которой необходимо искать модули вместо локального и глобального местаположения.
 */

function collect_all_deps(a_deps: string[], a_module_root?: string): string[] {
  const deps: string[] = [];

  function worker(module_name: string, node_module_path: string): boolean {
    const { sync_npm_deps } = new RearguardConfig(path.resolve(node_module_path, "package.json"));

    if (sync_npm_deps.length > 0) {
      if (!deps.includes(module_name)) {
        deps.push(module_name);
      }

      const items = collect_all_deps(sync_npm_deps, a_module_root);

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
  }

  for (const module_name of a_deps) {
    if (isString(a_module_root)) {
      const module_path = path.resolve(a_module_root, module_name);

      if (existsSync(module_path)) {
        if (worker(module_name, module_path)) {
          continue;
        }
      } else {
        console.log(
          chalk.red(
            `[ ORDERINNG_NPM_DEPS ][ COLLECT_ALL_DEPS ][ ERROR ]` + `[ You haven't module by path: ${module_path}; ]`,
          ),
        );

        process.exit(1);
      }
    } else {
      const global_path = envConfig.resolveGlobalModule(module_name);

      if (existsSync(global_path)) {
        if (worker(module_name, global_path)) {
          continue;
        }
      }

      const local_path = envConfig.resolveLocalModule(module_name);

      if (existsSync(local_path)) {
        if (worker(module_name, local_path)) {
          continue;
        }
      }

      console.log(
        chalk.red(
          `[ ORDERINNG_NPM_DEPS ][ COLLECT_ALL_DEPS ][ ERROR ]` +
            `[ You haven't link in global node_modules ${global_path}; ]`,
        ),
      );

      console.log(
        chalk.red(
          `[ ORDERINNG_NPM_DEPS ][ COLLECT_ALL_DEPS ][ ERROR ]` + `[ You haven't local node_modules ${local_path} ]`,
        ),
      );

      process.exit(1);
    }
  }

  return deps;
}

function calculate_weight_for_module(a_module_name: string, a_weight = 0, a_module_root?: string): number {
  function worker(node_module_path: string, weight: number): number {
    const { sync_npm_deps } = new RearguardConfig(path.resolve(node_module_path, "package.json"));

    if (sync_npm_deps.length > 0) {
      weight += sync_npm_deps.length;

      for (const module_name of sync_npm_deps) {
        weight += calculate_weight_for_module(module_name, 0, a_module_root);
      }

      return weight;
    } else {
      return weight;
    }
  }

  if (isString(a_module_root)) {
    const module_path = path.resolve(a_module_root, a_module_name);

    if (existsSync(module_path)) {
      return worker(module_path, a_weight);
    } else {
      console.log(
        chalk.red(
          `[ ORDERINNG_NPM_DEPS ][ calculate_weight_for_module ][ ERROR ]` +
            `[ You haven't module by path: ${module_path}; ]`,
        ),
      );

      process.exit(1);
    }
  }

  const global_path = envConfig.resolveGlobalModule(a_module_name);
  const local_path = envConfig.resolveLocalModule(a_module_name);

  if (existsSync(global_path)) {
    return worker(global_path, a_weight);
  }

  if (existsSync(local_path)) {
    return worker(local_path, a_weight);
  }

  console.log(
    chalk.red(
      `[ ORDERINNG_NPM_DEPS ][ calculate_weight_for_module ][ ERROR ]` +
        `[ You haven't link in local node_modules ${global_path}; ]`,
    ),
  );

  console.log(
    chalk.red(
      `[ ORDERINNG_NPM_DEPS ][ calculate_weight_for_module ][ ERROR ]` +
        `[ You haven't link in global node_modules ${global_path}; ]`,
    ),
  );

  process.exit(1);

  return 0;
}

export async function ordering_npm_deps(a_deps?: string[], a_module_root?: string): Promise<string[] | void> {
  console.log(chalk.bold.blue(`============ORDERINNG_PROJECT_DEPS=========`));
  const startTime = moment();
  console.log(chalk.bold.blue(`[ ORDERINNG_PROJECT_DEPS ][ RUN ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log("");
  /////////////////////
  //
  // START OF PROCEDURE
  //
  /////////////////////
  const deps = isArray(a_deps) && isString(a_module_root) ? a_deps : rearguardConfig.sync_npm_deps;
  const colected_deps = collect_all_deps(deps, a_module_root);
  const deps_weight: Array<{ name: string; weight: number }> = [];

  for (const dep of colected_deps) {
    deps_weight.push({ name: dep, weight: calculate_weight_for_module(dep, 0, a_module_root) });
  }

  const sync_npm_deps: string[] = deps_weight.sort((a, b) => (a.weight > b.weight ? 1 : -1)).map(({ name }) => name);

  if (!isArray(a_deps) || !isString(a_module_root)) {
    rearguardConfig.sync_npm_deps = sync_npm_deps;
  }

  /////////////////////
  //
  // END OF PROCEDURE
  //
  /////////////////////
  const endTime = moment();

  console.log(
    chalk.bold.blue(
      `[ ORDERINNG_PROJECT_DEPS ][ WORK_TIME ][ ${endTime.diff(startTime, "milliseconds")} ][ millisecond ]`,
    ),
  );
  console.log(chalk.bold.blue(`[ ORDERINNG_PROJECT_DEPS ][ DONE ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log(chalk.bold.blue(`===============================================`));
  console.log("");

  if (isArray(a_deps) && isString(a_module_root)) {
    return sync_npm_deps;
  }
}

// tslint:enable:variable-name
