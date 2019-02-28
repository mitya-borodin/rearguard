import { getErrorMessage } from "@borodindmitriy/utils";
import chalk from "chalk";
import { execSync } from "child_process";
import * as path from "path";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import { check_npm } from "../check_npm";

export async function install_declared_deps(envConfig: IEnvConfig, CWD: string = process.cwd()): Promise<boolean> {
  try {
    const { sync_project_deps, pkg } = new RearguardConfig(envConfig, path.resolve(CWD, "package.json"));

    if (sync_project_deps.length > 0) {
      console.log(chalk.bold.blue(`===========INSTALL_DECLARED_DEPS============`));
      console.log("");

      const npmIsAvailable: boolean = await check_npm();

      if (npmIsAvailable) {
        /////////////////////
        //
        // * START OF PROCEDURE
        //
        /////////////////////
        const deps: string[] = Object.keys(pkg.dependencies || {});
        const devDeps: string[] = Object.keys(pkg.devDependencies || {});
        const peerDeps: string[] = Object.keys(pkg.peerDependencies || {});
        const installList: string[] = [];

        for (const depName of sync_project_deps) {
          if (!deps.includes(depName) && !devDeps.includes(depName) && !peerDeps.includes(depName)) {
            installList.push(depName);
          }
        }

        if (installList.length > 0) {
          console.log(chalk.white(`npm install ${installList.join(" ")}`));
          console.log("");

          execSync(`npm install ${installList.join(" ")}`, {
            encoding: "utf8",
            stdio: "inherit",
          });

          console.log("");

          return true;
        } else {
          console.log(chalk.white(`Dependencies alredy installed`));

          console.log("");
        }
      }

      /////////////////////
      //
      // * END OF PROCEDURE
      //
      /////////////////////

      console.log(chalk.bold.blue(`============================================`));
      console.log("");
    }
  } catch (error) {
    console.trace(chalk.red(`[ ERROR_MESSAGE: ${getErrorMessage(error)} ]`));

    process.exit(1);
  }

  return false;
}
