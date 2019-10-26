import chalk from "chalk";
import { StartExecutorOptions } from "../../interfaces/executors/StartExecutorOptions";
import { buildOutdatedDependency } from "../procedures/buildOutdatedDependency";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { runWebpackDevServer } from "../procedures/runWebpackDevServer";
import { watchLinkedModules } from "../procedures/watchLinkedModules";

export async function start_browser_app(options: StartExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ BROWSER APP ][ START ]`));
  console.log("");
  const CWD: string = process.cwd();

  await buildOutdatedDependency(CWD);
  await deleteExternalBundles(CWD, true);
  await copyGlobalLinkedModules(CWD);
  await copyBundlesToProject(CWD);
  await watchLinkedModules(CWD);

  await runWebpackDevServer(CWD, !options.release, false, options.debug);
}
