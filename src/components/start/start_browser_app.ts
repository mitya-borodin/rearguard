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

export async function start_browser_app(options: StartExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ BROWSER APP ][ START ]`));
  console.log("");

  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const name = rearguardConfig.getName();

  await processQueue.getInQueue(name);

  await buildOutdatedDependency(CWD);
  await deleteExternalBundles(CWD, true);
  await copyGlobalLinkedModules(CWD);
  await copyBundlesToProject(CWD);
  await watchLinkedModules(CWD);

  processQueue.getOutQueue(name);

  await runWebpackDevServer(CWD, !options.release, false, options.debug);
}
