import chalk from "chalk";
import { StartExecutorOptions } from "../../interfaces/executors/StartExecutorOptions";
import { buildOutdatedDependency } from "../procedures/buildOutdatedDependency";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { runTsNodeDev } from "../procedures/runTsNodeDev";
import { watchLinkedModules } from "../procedures/watchLinkedModules";
import { runWebpackDevServer } from "../procedures/runWebpackDevServer";

export async function start_isomorphic(options: StartExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ ISOMORPHIC ][ START ]`));
  console.log("");
  const CWD: string = process.cwd();

  await buildOutdatedDependency(CWD);
  await deleteExternalBundles(CWD, true);
  await copyGlobalLinkedModules(CWD);
  await copyBundlesToProject(CWD);
  await watchLinkedModules(CWD);

  if (options.ts_node_dev) {
    await runTsNodeDev(CWD);
  } else {
    await runWebpackDevServer(CWD, !options.release, false, options.debug);
  }
}
