import chalk from "chalk";
import { buildOutdatedDependency } from "../procedures/buildOutdatedDependency";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { runTsNodeDev } from "../procedures/runTsNodeDev";
import { watchLinkedModules } from "../procedures/watchLinkedModules";

export async function start_node_lib(): Promise<void> {
  console.log(chalk.bold.blue(`[ NODE LIB ][ START ]`));
  console.log("");
  const CWD: string = process.cwd();

  await buildOutdatedDependency(CWD);
  await deleteExternalBundles(CWD, true);
  await copyGlobalLinkedModules(CWD);
  await copyBundlesToProject(CWD);
  await watchLinkedModules(CWD);
  await runTsNodeDev(CWD);
}
