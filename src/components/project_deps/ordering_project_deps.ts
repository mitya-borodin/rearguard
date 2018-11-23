import { isArray, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as moment from "moment";
import { rearguardConfig } from "../../config/rearguard";
import { flatten_deps } from "./flatten_deps";
import { get_module_weight } from "./get_module_weight";
// tslint:disable:variable-name

export async function ordering_project_deps(): Promise<void> {
  console.log(chalk.bold.blue(`============ORDERINNG_PROJECT_DEPS=========`));
  const startTime = moment();
  console.log(chalk.bold.blue(`[ ORDERINNG_PROJECT_DEPS ][ RUN ][ ${moment().format("YYYY-MM-DD hh:mm:ss")} ]`));
  console.log("");

  /////////////////////
  //
  // START OF PROCEDURE
  //
  /////////////////////

  const modules = flatten_deps(rearguardConfig.sync_project_deps);
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

  const endTime = moment();

  console.log(
    chalk.bold.blue(
      `[ ORDERINNG_PROJECT_DEPS ][ WORK_TIME ][ ${endTime.diff(startTime, "milliseconds")} ][ millisecond ]`,
    ),
  );
  console.log(chalk.bold.blue(`[ ORDERINNG_PROJECT_DEPS ][ DONE ][ ${moment().format("YYYY-MM-DD hh:mm:ss")} ]`));
  console.log(chalk.bold.blue(`===============================================`));
  console.log("");
}

// tslint:enable:variable-name
