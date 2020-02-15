import chalk from "chalk";
import execa from "execa";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { getSortedListOfMonoComponents } from "../procedures/getSortedListOfDependencies";
import { processQueue } from "../../helpers/processQueue";

export const group_bootstrap_component = async (options: {
  only_dev: boolean;
  debug: boolean;
}): Promise<void> => {
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

    await execa("rm", ["-rf", "./node_modules"], execaOptions);
    await execa("npm", ["install"], execaOptions);
    await execa("npm", ["link"], execaOptions);

    await execa("npm", ["run", "sync", "--", "--bypass_the_queue"], execaOptions);

    if (!isDll) {
      await execa("npm", ["run", "validate"], execaOptions);
    }

    await execa(
      "npm",
      [
        "run",
        "build",
        ...(options.debug ? ["--", "--debug"] : []),
        ...(options.only_dev ? ["--", "--only_dev"] : []),
        ...["--", "--bypass_the_queue"],
      ],
      execaOptions,
    );

    console.log("");
  }

  await processQueue.getOutQueue(name);
};
