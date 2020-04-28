import chalk from "chalk";
import execa from "execa";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { processQueue } from "../../helpers/processQueue";
import { updateVSCodeSettingsForMonoRepo } from "../procedures/updateVSCodeSettingsForMonoRepo";
import { watchCurrentModules } from "../procedures/watchCurrentModules";
import { watchLinkedModules } from "../procedures/watchLinkedModules";

export async function watch_component(): Promise<void> {
  try {
    const CWD: string = process.cwd();

    // * Create rearguard config
    const rearguardConfig = new RearguardConfig(CWD);

    // * Prepare data
    const name = rearguardConfig.getName();
    const isApp = rearguardConfig.isApp();
    const isLib = rearguardConfig.isLib();
    const isIsomorphic = rearguardConfig.isIsomorphic();
    const isBrowser = rearguardConfig.isBrowser();
    const isNode = rearguardConfig.isNode();

    if (isLib && (isIsomorphic || isBrowser || isNode)) {
      await updateVSCodeSettingsForMonoRepo(CWD);

      console.log(chalk.bold.blue(`[ TRACK CHANGES IN FILES AND BUILD ]`));
      console.log("");

      const execaOptions: execa.Options = {
        cwd: CWD,
        stdout: "inherit",
        stderr: "inherit",
      };

      await execa("npm", ["run", "build"], execaOptions);

      await processQueue.getInQueue(name);

      await watchLinkedModules(CWD);
      await watchCurrentModules(CWD);

      await processQueue.getOutQueue(name);
    }

    if (isApp && (isBrowser || isNode)) {
      console.log(chalk.bold.gray("rearguard watch - wasn't supported for node application"));
    }
  } catch (error) {
    console.error(error);
  }
}
