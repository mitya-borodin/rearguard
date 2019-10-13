import chalk from "chalk";
import * as moment from "moment";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { buildDllBundles } from "../procedures/buildDllBundles";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { buildLibBundles } from "../procedures/buildLibBundles";
import { buildLib } from "../procedures/buildLib";

export async function build_isomorphic(options: BuildExecutorOptions): Promise<void> {
  const CWD: string = process.cwd();

  console.log(options);

  // * Create rearguard config
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  // ! Set status.
  await rearguardLocalConfig.setBuildStatus("in_progress");

  console.log(chalk.bold.blue(`[ ISOMORPHIC ][ BUILD ][ START ]`));
  console.log("");

  const startTime = moment();

  await deleteExternalBundles(CWD, true);

  // ? Build DLL for Isomorphic build.
  await buildDllBundles(CWD, options);

  // ? Build Browser Lib for Isomorphic build.
  await buildLibBundles(CWD, options);

  // ? Build Node Lib for Isomorphic build.
  await buildLib(CWD);

  // ! Set status.
  await rearguardLocalConfig.setBuildStatus("done");

  console.log(
    chalk.bold.blue(
      `[ ISOMORPHIC ][ BUILD ][ END ][ ${moment().diff(startTime, "milliseconds")} ms ]`,
    ),
  );
  console.log("");
}
