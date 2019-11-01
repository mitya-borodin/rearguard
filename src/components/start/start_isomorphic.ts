import chalk from "chalk";
import { StartExecutorOptions } from "../../interfaces/executors/StartExecutorOptions";
import { buildOutdatedDependency } from "../procedures/buildOutdatedDependency";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { runTsNodeDev } from "../procedures/runTsNodeDev";
import { watchLinkedModules } from "../procedures/watchLinkedModules";
import { runWebpackDevServer } from "../procedures/runWebpackDevServer";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { processQueue } from "../../helpers/processQueue";
import { buildUnfinishedDependencies } from "../procedures/buildUnfinishedDependencies";
import { createListOfLoadOnDemand } from "../procedures/createListOfLoadOnDemand";

export async function start_isomorphic(options: StartExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ ISOMORPHIC ][ START ]`));
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

  if (options.ts_node_dev) {
    await runTsNodeDev(CWD);
  } else {
    await runWebpackDevServer(CWD, !options.release, false, options.debug);
  }
}
