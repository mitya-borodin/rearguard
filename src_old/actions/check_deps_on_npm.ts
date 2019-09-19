import { getErrorMessage, isObject, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { ChildProcess, exec, ExecException } from "child_process";
import { execSync } from "child_process";
import ora from "ora";
import * as semver from "semver";
import { isArray } from "util";
import { check_npm } from "../components/check_npm";
import { install_declared_deps } from "../components/project_deps/install_declared_deps";
import { install_dev_deps } from "../components/project_deps/install_dev_deps";
import { ordering_project_deps } from "../components/project_deps/ordering_project_deps";
import { sync_with_linked_modules } from "../components/project_deps/sync_with_linked_modules";
import { envConfig as instance_of_EnvConfig } from "../config/env";
import { rearguardConfig } from "../config/rearguard";
import { IEnvConfig } from "../interfaces/config/IEnvConfig";

async function search(depName: string): Promise<any[] | void> {
  return await new Promise<any[] | void>((resolve) => {
    let timeout: NodeJS.Timeout;

    const spinner = ora(`Search ${depName} on npm registry`).start();

    const childProcess: ChildProcess = exec(
      `npm search --json ${depName}`,
      { encoding: "utf8" },
      (error: ExecException | null, stdout: string) => {
        clearTimeout(timeout);

        if (!error) {
          try {
            const result: any[] = JSON.parse(stdout);

            if (isArray(result) && result.length > 0) {
              spinner.succeed(`${depName} is found`);
              resolve(result);
            } else {
              spinner.fail(`${depName} is not found`);
              resolve();
            }
          } catch (error) {
            spinner.fail(`${depName} is not found`);
            resolve();

            console.error(error);
          }
        } else {
          spinner.fail(`${depName} is not found`);
          resolve();
        }

        console.log("");
      },
    );

    timeout = setTimeout(() => {
      spinner.fail(`${depName} is not found`);
      console.log("");
      childProcess.kill();
      resolve();
    }, 10000);
  });
}

let needInstall: boolean = false;

async function checker(
  envConfig: IEnvConfig,
  target: string[],
  key: "dependencies" | "devDependencies" | "peerDependencies",
): Promise<void> {
  const { install_deps } = envConfig;
  const { pkg } = rearguardConfig;

  if (isObject(pkg[key])) {
    for (const targetDepName of target) {
      const curVersion: string | void = pkg[key][targetDepName];

      if (isString(curVersion)) {
        const result: any[] | void = await search(targetDepName);

        if (isArray(result) && result.length > 0) {
          const version = result[0].version;

          if (semver.valid(version) && semver.lt(curVersion, version)) {
            console.log(
              chalk.white(
                `[ VERSION FOR: ${chalk.bold.yellow(targetDepName)} ` +
                  `ON NPM REGISTRY IS: ${chalk.bold.yellow(version)} ]`,
              ),
            );

            if (install_deps) {
              console.log(
                chalk.white(
                  `[ VERSION FOR: ${chalk.bold.yellow(targetDepName)} ` +
                    `WILL UPDATE TO: ${chalk.bold.yellow(version)} ]`,
                ),
              );

              rearguardConfig.pkg = {
                [key]: { ...rearguardConfig.pkg[key], [targetDepName]: version },
              };

              needInstall = true;
            }

            console.log("");
          }
        }
      }
    }
  }
}

async function check_deps_on_npm(envConfig: IEnvConfig): Promise<void> {
  await install_declared_deps(envConfig);
  await install_dev_deps(envConfig);

  try {
    const { sync_project_deps } = rearguardConfig;
    const { install_deps } = envConfig;

    if (sync_project_deps.length > 0) {
      /////////////////////
      //
      // START OF PROCEDURE
      //
      /////////////////////
      console.log(chalk.bold.blue(`=============CHECK_DEPS_ON_NPM==============`));
      console.log("");

      const npmIsAvailable: boolean = await check_npm();

      if (npmIsAvailable) {
        await checker(envConfig, sync_project_deps, "dependencies");
        await checker(envConfig, sync_project_deps, "devDependencies");
        await checker(envConfig, sync_project_deps, "peerDependencies");

        if (install_deps && needInstall) {
          console.log(chalk.white(`npm install`));
          console.log("");

          execSync(`npm install`, {
            encoding: "utf8",
            stdio: "inherit",
          });

          console.log("");

          await ordering_project_deps(envConfig);
          await sync_with_linked_modules(envConfig);
        }
      }

      /////////////////////
      //
      // END OF PROCEDURE
      //
      /////////////////////

      console.log(chalk.bold.blue(`============================================`));
      console.log("");
    }
  } catch (error) {
    console.trace(chalk.red(`[ ERROR_MESSAGE: ${getErrorMessage(error)} ]`));

    process.exit(1);
  }
}

check_deps_on_npm(instance_of_EnvConfig);
