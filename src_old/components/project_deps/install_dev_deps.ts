import { getErrorMessage } from "@rtcts/utils";
import chalk from "chalk";
import { execSync } from "child_process";
import * as path from "path";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import { check_npm } from "../check_npm";

export async function install_dev_deps(
  envConfig: IEnvConfig,
  CWD: string = process.cwd(),
): Promise<boolean> {
  try {
    const { pkg } = new RearguardConfig(envConfig, path.resolve(CWD, "package.json"));
    let npmIsAvailable = false;
    console.log(chalk.bold.blue(`[ INSTALL_DEV_DEPS ][ START ]`));
    console.log("");

    /////////////////////
    //
    // * START OF PROCEDURE
    //
    /////////////////////

    // ! Install dev dependencies
    const devDeps: string[] = Object.keys(pkg.devDependencies || {});
    const installDevDepsList: string[] = [];

    for (const depName of [
      "typescript",
      "tslint",
      "ts-node-dev",
      "ts-node",
      "prettier",
      "husky",
      "mocha",
      "chai",
      "@types/node",
      "@types/mocha",
      "@types/chai",
    ]) {
      if (!devDeps.includes(depName)) {
        installDevDepsList.push(depName);
      }
    }

    const deps: string[] = Object.keys(pkg.dependencies || {});
    const installDepsList: string[] = [];

    for (const depName of ["tslib"]) {
      if (!deps.includes(depName)) {
        installDepsList.push(depName);
      }
    }

    if (installDevDepsList.length > 0) {
      if (!npmIsAvailable) {
        npmIsAvailable = await check_npm();
      }

      if (npmIsAvailable) {
        // tslint:disable-next-line: variable-name
        const command = `npm install -D -E ${installDevDepsList.join(" ")}`;

        console.log(chalk.white(command));
        console.log(chalk.white("npm install"));
        console.log("");

        execSync(command, {
          cwd: process.cwd(),
          encoding: "utf8",
          stdio: "inherit",
        });
      }
    } else {
      console.log(chalk.white(`Dev dependencies alredy installed`));

      console.log("");
    }

    // ! Install dependencies
    if (installDepsList.length > 0) {
      if (!npmIsAvailable) {
        npmIsAvailable = await check_npm();
      }

      if (npmIsAvailable) {
        const command = `npm install -S -E ${installDepsList.join(" ")}`;

        console.log(chalk.white(command));
        console.log(chalk.white("npm install"));
        console.log("");

        execSync(command, {
          cwd: process.cwd(),
          encoding: "utf8",
          stdio: "inherit",
        });
      }
    } else {
      console.log(chalk.white(`Dependencies alredy installed`));

      console.log("");
    }

    if (installDevDepsList.length > 0 || installDepsList.length > 0) {
      if (!npmIsAvailable) {
        npmIsAvailable = await check_npm();
      }

      if (npmIsAvailable) {
        execSync("npm install", {
          cwd: process.cwd(),
          encoding: "utf8",
          stdio: "inherit",
        });

        console.log("");

        return true;
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
