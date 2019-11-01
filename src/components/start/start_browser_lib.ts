import chalk from "chalk";
import { StartExecutorOptions } from "../../interfaces/executors/StartExecutorOptions";
import { buildOutdatedDependency } from "../procedures/buildOutdatedDependency";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { runWebpackDevServer } from "../procedures/runWebpackDevServer";
import { watchLinkedModules } from "../procedures/watchLinkedModules";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { processQueue } from "../../helpers/processQueue";
import { buildUnfinishedDependencies } from "../procedures/buildUnfinishedDependencies";
import { createListOfLoadOnDemand } from "../procedures/createListOfLoadOnDemand";

export async function start_browser_lib(options: StartExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ BROWSER LIB ][ START ]`));
  console.log("");
  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const name = rearguardConfig.getName();

  await processQueue.getInQueue(name);

  await buildUnfinishedDependencies(CWD);
  await buildOutdatedDependency(CWD);
  await deleteExternalBundles(CWD, true);
  await copyGlobalLinkedModules(CWD);
  await copyBundlesToProject(CWD);
  await createListOfLoadOnDemand(CWD, true);
  await watchLinkedModules(CWD);

  await processQueue.getOutQueue(name);

  await runWebpackDevServer(CWD, !options.release, false, options.debug);
}