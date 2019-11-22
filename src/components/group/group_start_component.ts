import inquirer from "inquirer";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { getSortedListOfMonoComponents } from "../procedures/getSortedListOfDependencies";
import execa from "execa";

export const group_start_component = async (options: {
  release: boolean;
  debug: boolean;
  ts_node_dev: boolean;
}): Promise<void> => {
  const CWD = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const components = rearguardConfig.getComponents();

  // await group_command_executor(["npm", "link"], true);
  const sortedListOfMonoComponents = await getSortedListOfMonoComponents(CWD, components);

  const question: any = {
    type: "list",
    name: "toStart",
    message: `Select the application to run`,
    choices: [],
  };

  const apps = new Map();

  for (const pathToComponent of sortedListOfMonoComponents) {
    const rearguardConfigItem = new RearguardConfig(pathToComponent);
    const name = rearguardConfigItem.getName();
    const isApp = rearguardConfigItem.isApp();

    if (isApp) {
      question.choices.push(name);
      apps.set(name, pathToComponent);
    }
  }

  const { toStart } = await inquirer.prompt([question]);

  const appCWD = apps.get(toStart);

  const execaOptions: execa.Options = {
    stdout: "inherit",
    stderr: "inherit",
    cwd: appCWD,
  };

  await execa(
    "npm",
    [
      "run",
      "start",
      ...(options.release ? ["--", "--release"] : []),
      ...(options.debug ? ["--", "--debug"] : []),
      ...(options.ts_node_dev ? ["--", "--ts_node_dev"] : []),
    ],
    execaOptions,
  );
};
