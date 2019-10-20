import chalk from "chalk";
import * as moment from "moment";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { buildDllBundles } from "../procedures/buildDllBundles";
import { buildLib } from "../procedures/buildLib";
import { buildLibBundles } from "../procedures/buildLibBundles";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { updatePkgFiles } from "../procedures/updatePkgFiles";
import { buildOutdatedDependency } from "../procedures/buildOutdatedDependency";

export async function build_browser_lib(options: BuildExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ BROWSER ][ LIB ][ BUILD ][ START ]`));
  console.log("");
  const startTime = moment();

  const CWD: string = process.cwd();
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  await rearguardLocalConfig.setBuildStatus("in_progress");
  await updatePkgFiles(CWD);

  await buildOutdatedDependency(CWD);

  await deleteExternalBundles(CWD, true);

  await copyGlobalLinkedModules(CWD);
  await copyBundlesToProject(CWD);

  await buildDllBundles(CWD, options);
  await buildLibBundles(CWD, options);
  await buildLib(CWD, true);

  await deleteExternalBundles(CWD);

  await rearguardLocalConfig.setBuildStatus("done");

  console.log(
    chalk.bold.blue(
      `[ BROWSER ][ LIB ][ BUILD ][ FINISH ][ ${moment().diff(startTime, "milliseconds")} ms ]`,
    ),
  );
  console.log("");
}
