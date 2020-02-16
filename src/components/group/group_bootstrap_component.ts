import chalk from "chalk";
import execa from "execa";
import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { processQueue } from "../../helpers/processQueue";
import { typingNonTypescriptModulesTemplate } from "../../templates/typingNonTypescriptModules";
import { getSortedListOfMonoComponents } from "../procedures/getSortedListOfDependencies";

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
    const context = path.resolve(pathToComponent, rearguardConfig.getContext());
    const isDll = rearguardConfigItem.isDll();

    const isBrowser = rearguardConfig.isBrowser();
    const isIsomorphic = rearguardConfig.isIsomorphic();

    if (isBrowser || isIsomorphic) {
      // ! Create type declaration for non typescript modules like a .css, .png, etc.
      await typingNonTypescriptModulesTemplate.render(options, context);
    }

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
