import chalk from "chalk";
import execa from "execa";
import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import {
  DISTRIBUTIVE_DIR_NAME,
  DLL_BUNDLE_DIR_NAME,
  LIB_BUNDLE_DIR_NAME,
  LIB_DIR_NAME,
} from "../../const";
import { processQueue } from "../../helpers/processQueue";
import { typingNonTypescriptModulesTemplate } from "../../templates/typingNonTypescriptModules";
import { getSortedListOfMonoComponents } from "../procedures/getSortedListOfDependencies";
import { group_command_executor } from "./executor";

export const group_bootstrap_component = async (options: {
  only_dev: boolean;
  debug: boolean;
}): Promise<void> => {
  const CWD = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const name = rearguardConfig.getName();
  const components = rearguardConfig.getComponents();

  await processQueue.getInQueue(name);

  await group_command_executor(
    [
      "rm",
      "-rf",
      "./node_modules",
      "package-lock.json",
      DISTRIBUTIVE_DIR_NAME,
      DLL_BUNDLE_DIR_NAME,
      LIB_BUNDLE_DIR_NAME,
      LIB_DIR_NAME,
    ],
    true,
    true,
  );
  await group_command_executor(["npm", "install"], true, true);
  await group_command_executor(["npm", "link"], true, true);

  const sortedListOfMonoComponents = await getSortedListOfMonoComponents(CWD, components);

  for (const pathToComponent of sortedListOfMonoComponents) {
    const rearguardConfigItem = new RearguardConfig(pathToComponent);
    const context = path.resolve(pathToComponent, rearguardConfig.getContext());

    const isDll = rearguardConfigItem.isDll();
    const isBrowser = rearguardConfigItem.isBrowser();
    const isIsomorphic = rearguardConfigItem.isIsomorphic();

    if (isBrowser || isIsomorphic) {
      // ! Create type declaration for non typescript modules like a .css, .png, etc.
      await typingNonTypescriptModulesTemplate.render(options, context);
    }

    const execaOptions: execa.Options = {
      stdout: "inherit",
      stderr: "inherit",
      cwd: pathToComponent,
    };

    console.log(
      chalk.bold.magenta(
        `[ ${rearguardConfigItem.getName()} ][ ${rearguardConfigItem.getVersion()} ]`,
      ),
    );
    console.log("");
    console.log(chalk.magenta(`[ CWD ][ ${pathToComponent} ]`));
    console.log("");

    console.log(
      chalk.magenta(
        `[ EXECUTED COMMAND ][ ${["npm", "run", "sync", "--", "--bypass_the_queue"].join(" ")} ]`,
      ),
    );
    console.log("");

    try {
      await execa("npm", ["run", "sync", "--", "--bypass_the_queue"], execaOptions);

      if (!isDll) {
        console.log(
          chalk.magenta(`[ EXECUTED COMMAND ][ ${["npm", "run", "make-prettier"].join(" ")} ]`),
        );
        console.log("");
        await execa("npm", ["run", "make-prettier"], execaOptions);

        console.log(
          chalk.magenta(`[ EXECUTED COMMAND ][ ${["npm", "run", "validate"].join(" ")} ]`),
        );
        console.log("");
        await execa("npm", ["run", "validate"], execaOptions);
      }

      console.log(
        chalk.magenta(
          `[ EXECUTED COMMAND ][ ${[
            "npm",
            "run",
            "build",
            ...(options.debug ? ["--", "--debug"] : []),
            ...(options.only_dev ? ["--", "--only_dev"] : []),
            ...["--", "--bypass_the_queue"],
          ].join(" ")} ]`,
        ),
      );
      console.log("");

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
    } catch (error) {
      console.error(error);
    }
  }

  await processQueue.getOutQueue(name);
};
