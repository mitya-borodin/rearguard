import { isArray, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as moment from "moment";
import { rearguardConfig } from "../../config/rearguard";
import { flatten_deps } from "./flatten_deps";
import { get_module_weight } from "./get_module_weight";
// tslint:disable:variable-name

export async function ordering_project_deps(): Promise<void> {
  const sync_project_deps = rearguardConfig.sync_project_deps;

  if (sync_project_deps.length > 0) {
    console.log(chalk.bold.blue(`[ ORDERINNG_PROJECT_DEPS ][ START ]`));
    console.log("");

    /////////////////////
    //
    // START OF PROCEDURE
    //
    /////////////////////

    const modules = flatten_deps(sync_project_deps);
    const result: string[] = modules
      .map((module) => ({ name: module, weight: get_module_weight(module, 0) }))
      .sort((a, b) => (a.weight > b.weight ? 1 : -1))
      .map(({ name }) => name);

    rearguardConfig.sync_project_deps = result;

    /////////////////////
    //
    // END OF PROCEDURE
    //
    /////////////////////

    console.log(chalk.bold.blue(`[ ORDERINNG_PROJECT_DEPS ][ END ]`));
    console.log("");
  }
}

// tslint:enable:variable-name
