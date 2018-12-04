import { isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { existsSync } from "fs";
import * as path from "path";
import { envConfig } from "../../config/env";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";

// tslint:disable:variable-name

export function get_module_weight(
  a_module_name: string,
  a_weight = 0,
  a_module_root?: string,
  a_module_map?: Map<string, string>,
): number {
  function worker(a_module_path: string, weight: number): number {
    const { sync_project_deps } = new RearguardConfig(envConfig, path.resolve(a_module_path, "package.json"));

    if (sync_project_deps.length > 0) {
      weight += sync_project_deps.length;

      for (const module_name of sync_project_deps) {
        weight += get_module_weight(module_name, 0, a_module_root, a_module_map);
      }

      return weight;
    } else {
      return weight;
    }
  }

  if (isString(a_module_root) && a_module_map) {
    const module_path = path.resolve(a_module_root, a_module_map.get(a_module_name) || "");

    if (existsSync(module_path)) {
      return worker(module_path, a_weight);
    } else {
      console.log(chalk.bold.red(`[ GET_MODULE_WEIGHT ][ ERROR ][ You haven't module by path: ${module_path}; ]`));

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
    chalk.bold.red(`[ GET_MODULE_WEIGHT ][ ERROR ][ You haven't link in local node_modules ${global_path}; ]`),
  );

  console.log(
    chalk.bold.red(`[ GET_MODULE_WEIGHT ][ ERROR ][ You haven't link in global node_modules ${global_path}; ]`),
  );

  process.exit(1);

  return 0;
}

// tslint:enable:variable-name
