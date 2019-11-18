import chalk from "chalk";
import moment from "moment";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { RearguardDevConfig } from "../../configs/RearguardDevConfig";
import { processQueue } from "../../helpers/processQueue";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { buildBrowserApp } from "../procedures/build/buildBrowserApp";
import { buildOutdatedDependency } from "../procedures/build/buildOutdatedDependency";
import { buildUnfinishedDependencies } from "../procedures/build/buildUnfinishedDependencies";
import { copyBundlesAndPublicToDist } from "../procedures/copyBundlesAndPublicToDist";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { createListOfLoadOnDemand } from "../procedures/createListOfLoadOnDemand";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";

export async function build_browser_app(options: BuildExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ BROWSER ][ APP ][ BUILD ][ START ]`));
  console.log("");
  const startTime = moment();

  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const name = rearguardConfig.getName();
  const rearguardLocalConfig = new RearguardDevConfig(CWD);

  await processQueue.getInQueue(name, options.bypass_the_queue);

  await rearguardLocalConfig.setBuildStatus("in_progress");

  await buildUnfinishedDependencies(CWD);
  await buildOutdatedDependency(CWD);
  await deleteExternalBundles(CWD, true);
  await copyGlobalLinkedModules(CWD);
  await copyBundlesToProject(CWD);
  await createListOfLoadOnDemand(CWD, false);

  await buildBrowserApp(CWD, options);

  await copyBundlesAndPublicToDist(CWD);

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
