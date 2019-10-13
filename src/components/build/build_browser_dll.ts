import chalk from "chalk";
import * as moment from "moment";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { buildDllBundles } from "../procedures/buildDllBundles";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";

export async function build_browser_dll(options: BuildExecutorOptions): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  // ! Set status.
  await rearguardLocalConfig.setBuildStatus("in_progress");

  console.log(chalk.bold.blue(`[ DLL ][ BUILD ][ START ]`));
  console.log("");

  const startTime = moment();

  await deleteExternalBundles(CWD, true);

  await buildDllBundles(CWD, options);

  // ! Set status.
  await rearguardLocalConfig.setBuildStatus("done");

  console.log("");
  console.log(
    chalk.bold.blue(`[ DLL ][ BUILD ][ END ][ ${moment().diff(startTime, "milliseconds")} ms ]`),
  );
  console.log("");
}
