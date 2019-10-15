import chalk from "chalk";
import * as moment from "moment";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { buildBrowserApp } from "../procedures/buildBrowserApp";
import { copyBundlesAndPublicToDist } from "../procedures/copyBundlesAndPublicToDist";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { updatePkgFiles } from "../procedures/updatePkgFiles";

export async function build_browser_app(options: BuildExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ DLL ][ BUILD ][ START ]`));
  console.log("");
  const startTime = moment();

  const CWD: string = process.cwd();
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  await rearguardLocalConfig.setBuildStatus("in_progress");

  await updatePkgFiles(CWD);

  await deleteExternalBundles(CWD, true);

  await copyGlobalLinkedModules(CWD);
  await copyBundlesToProject(CWD);

  await buildBrowserApp(CWD, options);

  await copyBundlesAndPublicToDist(CWD);

  await rearguardLocalConfig.setBuildStatus("done");

  console.log("");
  console.log(
    chalk.bold.blue(`[ DLL ][ BUILD ][ FINISH ][ ${moment().diff(startTime, "milliseconds")} ms ]`),
  );
  console.log("");
}
