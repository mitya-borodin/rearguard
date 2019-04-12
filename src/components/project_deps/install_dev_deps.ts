import { getErrorMessage } from "@borodindmitriy/utils";
import chalk from "chalk";
import { execSync } from "child_process";
import * as path from "path";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import { check_npm } from "../check_npm";

export async function install_dev_deps(envConfig: IEnvConfig, CWD: string = process.cwd()): Promise<boolean> {
  try {
    const { pkg } = new RearguardConfig(envConfig, path.resolve(CWD, "package.json"));

    console.log(chalk.bold.blue(`[ INSTALL_DEV_DEPS ][ START ]`));
    console.log("");

    const npmIsAvailable: boolean = await check_npm();

    if (npmIsAvailable) {
      /////////////////////
      //
      // * START OF PROCEDURE
      //
      /////////////////////
      const devDeps: string[] = Object.keys(pkg.devDependencies || {});
      const installList: string[] = [];

      for (const depName of ["typescript", "tslint", "ts-node-dev", "prettier", "husky", "@types/node"]) {
        if (!devDeps.includes(depName)) {
          installList.push(depName);
        }
      }

      if (installList.length > 0) {
        const command = `npm install -D ${installList.join(" ")}`;

        console.log(chalk.white(command));
        console.log(chalk.white("npm install"));
        console.log("");

        execSync(command, {
          cwd: process.cwd(),
          encoding: "utf8",
          stdio: "inherit",
        });

        execSync("npm install", {
          cwd: process.cwd(),
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

    console.log(chalk.bold.blue(`[ INSTALL_DEV_DEPS ][ END ]`));
    console.log("");
  } catch (error) {
    console.trace(chalk.red(`[ ERROR_MESSAGE: ${getErrorMessage(error)} ]`));

    process.exit(1);
  }

  return false;
}
