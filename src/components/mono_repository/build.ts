import chalk from "chalk";
import * as spawn from "cross-spawn";
import * as moment from "moment";
import * as path from "path";
import { envConfig } from "../../config/env";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";

export async function build(CWD: string) {
  const rearguardConfig = new RearguardConfig(envConfig, path.resolve(CWD, "package.json"));

  console.log(chalk.bold.green(`[ ${rearguardConfig.pkg.name} ][ BUILD ]`));
  console.log("");

  if (envConfig.isDevelopment) {
    const result = spawn.sync("npm", ["run", "build"], {
      cwd: CWD,
      encoding: "utf8",
      stdio: "inherit",
    });

    // ! Обработка сигнала.
    if (result.signal) {
      if (result.signal === "SIGKILL") {
        console.log(
          chalk.red(
            "The build failed because the process exited too early. " +
              "This probably means the system ran out of memory or someone called `kill -9` on the process.",
          ),
        );

        process.exit(1);
      } else if (result.signal === "SIGTERM") {
        console.log(
          chalk.bold.red(
            "The build failed because the process exited too early. " +
              "Someone might have called `kill` or `killall`, or the system could be shutting down.",
          ),
        );

        process.exit(1);
      }

      process.exit(0);
    }
  } else {
    // tslint:disable-next-line:variable-name
    const result_release = spawn.sync("npm", ["run", "build:both"], {
      cwd: CWD,
      encoding: "utf8",
      stdio: "inherit",
    });

    // ! Обработка сигнала.
    if (result_release.signal) {
      if (result_release.signal === "SIGKILL") {
        console.log(
          chalk.red(
            "The build failed because the process exited too early. " +
              "This probably means the system ran out of memory or someone called `kill -9` on the process.",
          ),
        );

        process.exit(1);
      } else if (result_release.signal === "SIGTERM") {
        console.log(
          chalk.bold.red(
            "The build failed because the process exited too early. " +
              "Someone might have called `kill` or `killall`, or the system could be shutting down.",
          ),
        );

        process.exit(1);
      }

      process.exit(0);
    }
  }

  rearguardConfig.last_build_time = moment();

  console.log(chalk.green(`[ ${rearguardConfig.pkg.name} ][ BUILD ][ END ]`));
  console.log("");
}
