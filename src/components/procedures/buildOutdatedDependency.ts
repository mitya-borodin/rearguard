import chalk from "chalk";
import * as execa from "execa";
import ora from "ora";
import { getOutdatedDependency } from "./getOutdatedDependency";

export const buildOutdatedDependency = async (CWD: string): Promise<void> => {
  const outdatedDependency = await getOutdatedDependency(CWD);

  if (outdatedDependency.size > 0) {
    console.log(chalk.bold.blue(`[ BUILD OUTDATED DEPENDENCIES ]`));
    console.log("");

    for (const dependency of outdatedDependency) {
      const dirNames = dependency.split("/");
      console.log(chalk.blue(`${dirNames[dirNames.length - 1]}: ${dependency}`));
    }
    console.log("");

    for (const dependency of outdatedDependency) {
      const dirNames = dependency.split("/");
      const spinner = ora(`build: ${dirNames[dirNames.length - 1]}`).start();

      try {
        await execa(
          "npm",
          ["run", "build", "--", "--need_update_build_time", "--bypass_the_queue"],
          { cwd: dependency },
        );

        if (spinner) {
          spinner.succeed();
        }
      } catch (error) {
        if (spinner) {
          spinner.fail();
        }
        console.error(error);
      }
    }
  }
};
