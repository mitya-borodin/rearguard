import chalk from "chalk";
import execa from "execa";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { processQueue } from "../../helpers/processQueue";
import { getSortedListOfMonoComponents } from "../procedures/getSortedListOfDependencies";

export const group_command_executor = async (
  [command, ...params]: string[],
  withDll = false,
): Promise<void> => {
  const CWD = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const name = rearguardConfig.getName();
  const components = rearguardConfig.getComponents();

  await processQueue.getInQueue(name);

  const sortedListOfMonoComponents = await getSortedListOfMonoComponents(CWD, components);

  for (const pathToComponent of sortedListOfMonoComponents) {
    const execaOptions: execa.Options = {
      stdout: "inherit",
      stderr: "inherit",
      cwd: pathToComponent,
    };
    const rearguardConfigItem = new RearguardConfig(pathToComponent);
    const isDll = rearguardConfigItem.isDll();

    console.log(chalk.bold.blue(`[ ${pathToComponent} ]`));
    console.log("");

    if (!isDll || withDll) {
      await execa(command, params, execaOptions);
    }

    console.log("");
  }

  await processQueue.getOutQueue(name);
};
