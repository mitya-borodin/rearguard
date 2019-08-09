import chalk from "chalk";
import { rearguardConfig } from "../../config/rearguard";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import { flatten_deps } from "./flatten_deps";
import { get_module_weight } from "./get_module_weight";
// tslint:disable:variable-name

export async function ordering_project_deps(envConfig: IEnvConfig): Promise<void> {
  let sync_project_deps: string[] = rearguardConfig.sync_project_deps;

  if (sync_project_deps.length > 0) {
    console.log(chalk.bold.blue(`[ ORDERING_PROJECT_DEPS ][ START ]`));
    console.log("");

    /////////////////////
    //
    // * START OF PROCEDURE
    //
    /////////////////////

    const modules: string[] = flatten_deps(envConfig, sync_project_deps);
    sync_project_deps = modules
      .map((module) => ({ name: module, weight: get_module_weight(envConfig, module, 0) }))
      .sort((a, b) => (a.weight > b.weight ? 1 : -1))
      .map(({ name }) => name);

    rearguardConfig.sync_project_deps = sync_project_deps;

    /////////////////////
    //
    // * END OF PROCEDURE
    //
    /////////////////////

    console.log(chalk.bold.blue(`[ ORDERINNG_PROJECT_DEPS ][ END ]`));
    console.log("");
  }
}

// tslint:enable:variable-name
