import chalk from "chalk";
import moment from "moment";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { RearguardDevConfig } from "../../configs/RearguardDevConfig";
import { processQueue } from "../../helpers/processQueue";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { buildDllBundles } from "../procedures/build/buildDllBundles";
import { deleteExternalBundles } from "../procedures/deleteExternalBundles";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { copyBundlesToProject } from "../procedures/copyBundlesToProject";

export async function build_browser_dll(options: BuildExecutorOptions): Promise<void> {
  try {
    console.log(chalk.bold.blue(`[ DLL ][ BUILD ][ START ]`));
    console.log("");
    const startTime = moment();

    const CWD: string = process.cwd();
    const rearguardLocalConfig = new RearguardDevConfig(CWD);
    const rearguardConfig = new RearguardConfig(CWD);
    const name = rearguardConfig.getName();

    await processQueue.getInQueue(name, options.bypass_the_queue);

    await rearguardLocalConfig.setBuildStatus("in_progress");

    await deleteExternalBundles(CWD, true);
    await copyGlobalLinkedModules(CWD);
    await copyBundlesToProject(CWD);

    await buildDllBundles(CWD, options);

    await rearguardLocalConfig.setBuildStatus("done");

    await processQueue.getOutQueue(name, options.bypass_the_queue);

    console.log("");
    console.log(
      chalk.bold.blue(
        `[ DLL ][ BUILD ][ FINISH ][ ${moment().diff(startTime, "milliseconds")} ms ]`,
      ),
    );
    console.log("");
  } catch (error) {
    console.trace(error);
  }
}
