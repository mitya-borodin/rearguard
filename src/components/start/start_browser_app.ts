import chalk from "chalk";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { processQueue } from "../../helpers/processQueue";
import { StartExecutorOptions } from "../../interfaces/executors/StartExecutorOptions";
import { buildOutdatedDependency } from "../procedures/build/buildOutdatedDependency";
import { buildUnfinishedDependencies } from "../procedures/build/buildUnfinishedDependencies";
import { checkNotInstalledDependencies } from "../procedures/checkNotInstalledDependencies";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { createListOfLoadOnDemand } from "../procedures/createListOfLoadOnDemand";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { runWebpackDevServer } from "../procedures/runWebpackDevServer";
import { watchLinkedModules } from "../procedures/watchLinkedModules";

export async function start_browser_app(options: StartExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ BROWSER APP ][ START ]`));
  console.log("");

  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const name = rearguardConfig.getName();

  await processQueue.getInQueue(name);

  await checkNotInstalledDependencies(CWD);
  await buildUnfinishedDependencies(CWD);
  await buildOutdatedDependency(CWD);
  await deleteExternalBundles(CWD);
  await copyGlobalLinkedModules(CWD);
  await copyBundlesToProject(CWD);
  await createListOfLoadOnDemand(CWD, true);
  await watchLinkedModules(CWD);

  await processQueue.getOutQueue(name);

  await runWebpackDevServer(CWD, !options.release, false, options.debug);
}
