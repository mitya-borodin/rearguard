import chalk from "chalk";
import * as moment from "moment";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { buildLib } from "../procedures/buildLib";
import { updatePkgFiles } from "../procedures/updatePkgFiles";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { processQueue } from "../../helpers/processQueue";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";

export async function build_node_lib(options: BuildExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ NODE ][ LIB ][ BUILD ][ START ]`));
  console.log("");
  const startTime = moment();

  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);
  const name = rearguardConfig.getName();

  await processQueue.getInQueue(name, options.bypass_the_queue);

  await rearguardLocalConfig.setBuildStatus("in_progress");
  await updatePkgFiles(CWD);

  await copyGlobalLinkedModules(CWD);

  await buildLib(CWD);

  await rearguardLocalConfig.setBuildStatus("done");

  processQueue.getOutQueue(name, options.bypass_the_queue);

  await rearguardLocalConfig.setLastBuildTime();

  console.log(
    chalk.bold.blue(
      `[ NODE ][ LIB ][ BUILD ][ FINISH ][ ${moment().diff(startTime, "milliseconds")} ms ]`,
    ),
  );
  console.log("");
}
