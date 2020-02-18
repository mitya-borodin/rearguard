import chalk from "chalk";
import execa from "execa";
import semver from "semver";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { getSortedListOfMonoComponents } from "../procedures/getSortedListOfDependencies";
import { processQueue } from "../../helpers/processQueue";
import { group_command_executor } from "./executor";

export const group_publish_component = async (options: {
  patch: boolean;
  minor: boolean;
  major: boolean;
}): Promise<void> => {
  const CWD = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const name = rearguardConfig.getName();
  const components = rearguardConfig.getComponents();

  await processQueue.getInQueue(name);

  const sortedListOfMonoComponents = await getSortedListOfMonoComponents(CWD, components);

  for (const pathToComponent of sortedListOfMonoComponents) {
    const rearguardConfigItem = new RearguardConfig(pathToComponent);
    let version = rearguardConfigItem.getVersion();

    if (options.major) {
      version = semver.inc(version, "major") || version;
    } else if (options.minor) {
      version = semver.inc(version, "minor") || version;
    } else {
      version = semver.inc(version, "patch") || version;
    }

    if (semver.lte(rearguardConfigItem.getVersion(), version)) {
      await rearguardConfigItem.setVersion(version);
    }
  }

  await group_command_executor(["npm", "run", "build", "--", "--bypass_the_queue"], true);

  for (const pathToComponent of sortedListOfMonoComponents) {
    const rearguardConfigItem = new RearguardConfig(pathToComponent);

    console.log(
      chalk.bold.magenta(
        `[ ${rearguardConfigItem.getName()} ][ ${rearguardConfigItem.getVersion()} ]`,
      ),
    );
    console.log("");
    console.log(chalk.magenta(`[ CWD ][ ${pathToComponent} ]`));
    console.log("");

    console.log(chalk.magenta(`[ EXECUTED COMMAND ][ ${["npm", "publish"].join(" ")} ]`));
    console.log("");

    const execaOptions: execa.Options = {
      stdout: "inherit",
      stderr: "inherit",
      cwd: pathToComponent,
    };

    await execa("npm", ["publish"], execaOptions);
  }

  console.log("");

  await processQueue.getOutQueue(name);
};
