import chalk from "chalk";
import * as moment from "moment";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { buildBrowserApp } from "../procedures/buildBrowserApp";
import { copyBundlesAndPublicToDist } from "../procedures/copyBundlesAndPublicToDist";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { buildOutdatedDependency } from "../procedures/buildOutdatedDependency";
import { createListOfLoadOnDemand } from "../procedures/createListOfLoadOnDemand";
import { processQueue } from "../../helpers/processQueue";
import { RearguardConfig } from "../../configs/RearguardConfig";

export async function build_browser_app(options: BuildExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ BROWSER ][ APP ][ BUILD ][ START ]`));
  console.log("");
  const startTime = moment();

  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const name = rearguardConfig.getName();
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  await processQueue.getInQueue(name, options.bypass_the_queue);

  await rearguardLocalConfig.setBuildStatus("in_progress");

  await buildOutdatedDependency(CWD);

  await deleteExternalBundles(CWD, true);

  await copyGlobalLinkedModules(CWD);
  await copyBundlesToProject(CWD);

  await buildBrowserApp(CWD, options);

  await copyBundlesAndPublicToDist(CWD);

  await createListOfLoadOnDemand(CWD, false);

  await rearguardLocalConfig.setBuildStatus("done");

  await processQueue.getOutQueue(name, options.bypass_the_queue);

  console.log("");
  console.log(
    chalk.bold.blue(
      `[ BROWSER ][ APP ][ BUILD ][ FINISH ][ ${moment().diff(startTime, "milliseconds")} ms ]`,
    ),
  );
  console.log("");
}
