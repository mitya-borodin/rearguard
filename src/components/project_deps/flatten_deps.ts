import { isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { existsSync } from "fs";
import * as path from "path";
import { envConfig } from "../../config/env";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";

// tslint:disable:variable-name
/**
 *
 * @param a_cur_project_deps - список имен модулей от которых зависит проект
 * @param a_modules_root_directory - директория в которой находятся все модули
 */
export function flatten_deps(
  a_cur_project_deps: string[],
  a_modules_root_directory?: string,
  a_module_map?: Map<string, string>,
): string[] {
  const flat_deps: Set<string> = new Set();

  function worker(module_name: string, node_module_path: string): boolean {
    const { sync_project_deps } = new RearguardConfig(envConfig, path.resolve(node_module_path, "package.json"));

    if (sync_project_deps.length > 0) {
      flat_deps.add(module_name);

      const items = flatten_deps(sync_project_deps, a_modules_root_directory);

      for (const item of items) {
        flat_deps.add(item);
      }

      return true;
    } else {
      flat_deps.add(module_name);

      return true;
    }
  }

  for (const module_name of a_cur_project_deps) {
    if (isString(a_modules_root_directory) && a_module_map) {
      const module_path = path.resolve(a_modules_root_directory, a_module_map.get(module_name) || "");

      if (existsSync(module_path)) {
        if (worker(module_name, module_path)) {
          continue;
        }
      } else {
        console.log(chalk.bold.red(`[ FLATTEN_DEPS ][ ERROR ][ You haven't module by path: ${module_path}; ]`));

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
        chalk.bold.red(`[ FLAT_DEPS_DEEP ][ ERROR ][ You haven't link in global node_modules ${global_path}; ]`),
      );

      console.log(chalk.bold.red(`[ FLAT_DEPS_DEEP ][ ERROR ][ You haven't local node_modules ${local_path} ]`));

      process.exit(1);
    }
  }

  return Array.from(flat_deps);
}

// tslint:enable:variable-name
