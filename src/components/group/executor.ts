import chalk from "chalk";
import execa from "execa";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { processQueue } from "../../helpers/processQueue";
import { getSortedListOfMonoComponents } from "../procedures/getSortedListOfDependencies";
import { updateVSCodeSettingsForMonoRepo } from "../procedures/updateVSCodeSettingsForMonoRepo";

export const group_command_executor = async (
  [command, ...params]: string[],
  withDll = false,
  bypassTheQueue = false,
): Promise<void> => {
  const CWD = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const name = rearguardConfig.getName();
  const components = rearguardConfig.getComponents();

  await updateVSCodeSettingsForMonoRepo(CWD);

  await processQueue.getInQueue(name, bypassTheQueue);

  const sortedListOfMonoComponents = await getSortedListOfMonoComponents(CWD, components);

  for (const pathToComponent of sortedListOfMonoComponents) {
    const execaOptions: execa.Options = {
      stdout: "inherit",
      stderr: "inherit",
      cwd: pathToComponent,
    };
    const rearguardConfigItem = new RearguardConfig(pathToComponent);
    const isDll = rearguardConfigItem.isDll();

    console.log(
      chalk.bold.magenta(
        `[ ${rearguardConfigItem.getName()} ][ ${rearguardConfigItem.getVersion()} ]`,
      ),
    );
    console.log("");
    console.log(chalk.magenta(`[ CWD ][ ${pathToComponent} ]`));
    console.log("");

    if (!isDll || withDll) {
      console.log(chalk.magenta(`[ EXECUTED COMMAND ][ ${[command, ...params].join(" ")} ]`));
      console.log("");

      await execa(command, params, execaOptions);
    }

    console.log("");
  }

  await processQueue.getOutQueue(name, bypassTheQueue);
};
