import chalk from "chalk";
import { buildOutdatedDependency } from "../procedures/buildOutdatedDependency";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { watchLinkedModules } from "../procedures/watchLinkedModules";
import { runNodeServer } from "../procedures/runNodeServer";

export async function start_node_app(): Promise<void> {
  console.log(chalk.bold.blue(`[ NODE APP ][ START ]`));
  console.log("");
  const CWD: string = process.cwd();

  await buildOutdatedDependency(CWD);
  await deleteExternalBundles(CWD, true);
  await copyGlobalLinkedModules(CWD);
  await copyBundlesToProject(CWD);
  await watchLinkedModules(CWD);
  await runNodeServer(CWD);
}
