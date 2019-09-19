import chalk from "chalk";
import * as moment from "moment";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import { flatten_deps } from "./flatten_deps";
import { get_module_weight } from "./get_module_weight";

// tslint:disable:variable-name

export async function get_list_of_ordered_modules(
  envConfig: IEnvConfig,
  a_root: string,
  a_modules: string[],
  a_module_map: Map<string, string>,
): Promise<string[]> {
  console.log(chalk.bold.blue(`============GET_LIST_OF_ORDERED_MODULES=========`));
  const startTime = moment();
  console.log(chalk.bold.blue(`[ GET_LIST_OF_ORDERED_MODULES ][ RUN ][ ${moment().format("YYYY-MM-DD hh:mm:ss")} ]`));
  console.log("");

  /////////////////////
  //
  // START OF PROCEDURE
  //
  /////////////////////

  const modules = flatten_deps(envConfig, a_modules, a_root, a_module_map);
  const result: string[] = modules
    .map((module) => ({
      name: module,
      weight: get_module_weight(envConfig, module, 0, a_root, a_module_map),
    }))
    .sort((a, b) => (a.weight > b.weight ? 1 : -1))
    .map(({ name }) => name);

  /////////////////////
  //
  // END OF PROCEDURE
  //
  /////////////////////

  const endTime = moment();

  console.log(
    chalk.bold.blue(
      `[ GET_LIST_OF_ORDERED_MODULES ][ WORK_TIME ][ ${endTime.diff(startTime, "milliseconds")} ][ millisecond ]`,
    ),
  );
  console.log(chalk.bold.blue(`[ GET_LIST_OF_ORDERED_MODULES ][ DONE ][ ${moment().format("YYYY-MM-DD hh:mm:ss")} ]`));
  console.log(chalk.bold.blue(`================================================`));
  console.log("");

  return result;
}

// tslint:enable:variable-name
