import chalk from "chalk";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { processQueue } from "../../helpers/processQueue";
import { buildOutdatedDependency } from "../procedures/build/buildOutdatedDependency";
import { buildUnfinishedDependencies } from "../procedures/build/buildUnfinishedDependencies";
import { checkNotInstalledDependencies } from "../procedures/checkNotInstalledDependencies";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { runNodeServer } from "../procedures/runNodeServer";
import { watchLinkedModules } from "../procedures/watchLinkedModules";

export async function start_node_app(): Promise<void> {
  console.log(chalk.bold.blue(`[ NODE APP ][ START ]`));
  console.log("");

  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const name = rearguardConfig.getName();

  await processQueue.getInQueue(name);

  await checkNotInstalledDependencies(CWD);
  await buildUnfinishedDependencies(CWD);
  await buildOutdatedDependency(CWD);
  await deleteExternalBundles(CWD, true);
  await copyGlobalLinkedModules(CWD);
  await copyBundlesToProject(CWD);
  await watchLinkedModules(CWD);

  await processQueue.getOutQueue(name);

  await runNodeServer(CWD);
}
