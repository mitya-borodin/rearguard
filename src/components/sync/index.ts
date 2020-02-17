import chalk from "chalk";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { RearguardDevConfig } from "../../configs/RearguardDevConfig";
import { processQueue } from "../../helpers/processQueue";
import { SyncExecutorOptions } from "../../interfaces/executors/SyncExecutorOptions";
import { buildOutdatedDependency } from "../procedures/build/buildOutdatedDependency";
import { buildUnfinishedDependencies } from "../procedures/build/buildUnfinishedDependencies";
import { checkNotInstalledDependencies } from "../procedures/checkNotInstalledDependencies";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { createListOfLoadOnDemand } from "../procedures/createListOfLoadOnDemand";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { updateVSCodeSettingsForMonoRepo } from "../procedures/updateVSCodeSettingsForMonoRepo";
import moment = require("moment");

export async function sync_component(options: SyncExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ SYNC ][ START ]`));
  console.log("");
  const startTime = moment();

  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const name = rearguardConfig.getName();
  const isDll = rearguardConfig.isDll();
  const isNode = rearguardConfig.isNode();
  const rearguardLocalConfig = new RearguardDevConfig(CWD);

  await updateVSCodeSettingsForMonoRepo(CWD);

  await processQueue.getInQueue(name, options.bypass_the_queue);

  await rearguardLocalConfig.setBuildStatus("in_progress");

  await checkNotInstalledDependencies(CWD);

  if (!isDll && !isNode) {
    await buildUnfinishedDependencies(CWD);
    await buildOutdatedDependency(CWD);
    await deleteExternalBundles(CWD, true);
    await copyGlobalLinkedModules(CWD);
    await copyBundlesToProject(CWD);
    await createListOfLoadOnDemand(CWD, false);
  }

  if (isNode) {
    await buildUnfinishedDependencies(CWD);
    await copyGlobalLinkedModules(CWD);
  }

  await rearguardLocalConfig.setBuildStatus("done");

  await processQueue.getOutQueue(name, options.bypass_the_queue);

  console.log("");
  console.log(
    chalk.bold.blue(`[ SYNC ][ FINISH ][ ${moment().diff(startTime, "milliseconds")} ms ]`),
  );
  console.log("");
}
