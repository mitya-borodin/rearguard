import chalk from "chalk";
import * as moment from "moment";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { RearguardDevConfig } from "../../configs/RearguardDevConfig";
import { processQueue } from "../../helpers/processQueue";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { buildLib } from "../procedures/build/buildLib";
import { buildUnfinishedDependencies } from "../procedures/build/buildUnfinishedDependencies";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { updatePkgFiles } from "../procedures/updatePkgFiles";

export async function build_node_lib(options: BuildExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ NODE ][ LIB ][ BUILD ][ START ]`));
  console.log("");
  const startTime = moment();

  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardDevConfig(CWD);
  const name = rearguardConfig.getName();

  await processQueue.getInQueue(name, options.bypass_the_queue);

  await rearguardLocalConfig.setBuildStatus("in_progress");
  await updatePkgFiles(CWD);

  await buildUnfinishedDependencies(CWD);
  await copyGlobalLinkedModules(CWD);

  await buildLib(CWD);

  await rearguardLocalConfig.setBuildStatus("done");

  await processQueue.getOutQueue(name, options.bypass_the_queue);

  await rearguardLocalConfig.setLastBuildTime();

  console.log(
    chalk.bold.blue(
      `[ NODE ][ LIB ][ BUILD ][ FINISH ][ ${moment().diff(startTime, "milliseconds")} ms ]`,
    ),
  );
  console.log("");
}
