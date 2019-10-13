import chalk from "chalk";
import * as moment from "moment";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { buildDllBundles } from "../procedures/buildDllBundles";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";

export async function build_browser_dll(options: BuildExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ DLL ][ BUILD ][ START ]`));
  console.log("");
  const startTime = moment();

  const CWD: string = process.cwd();
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  await rearguardLocalConfig.setBuildStatus("in_progress");

  await deleteExternalBundles(CWD, true);

  await buildDllBundles(CWD, options);

  await rearguardLocalConfig.setBuildStatus("done");

  console.log("");
  console.log(
    chalk.bold.blue(`[ DLL ][ BUILD ][ FINISH ][ ${moment().diff(startTime, "milliseconds")} ms ]`),
  );
  console.log("");
}
