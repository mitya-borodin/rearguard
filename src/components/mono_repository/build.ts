import chalk from "chalk";
import * as spawn from "cross-spawn";
import * as path from "path";
import { envConfig } from "../../config/env";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";

export async function build(CWD: string, needUpdateBuildTime = false) {
  const rearguardConfig = new RearguardConfig(envConfig, path.resolve(CWD, "package.json"));

  console.log(chalk.bold.green(`[ ${rearguardConfig.pkg.name} ][ BUILD ]`));
  console.log("");

  let result: any;

  const srcipts = rearguardConfig.pkg.scripts;

  if (srcipts && Object.keys(srcipts).length > 0) {
    if (envConfig.isBuildBoth) {
      // tslint:disable-next-line:variable-name
      result = spawn.sync(
        "rearguard",
        [
          ...srcipts["build:both"].replace("rearguard ", "").split(" "),
          ...(needUpdateBuildTime ? ["--needUpdateBuildTime"] : []),
        ],
        {
          cwd: CWD,
          encoding: "utf8",
          stdio: "inherit",
        },
      );
    } else {
      if (!envConfig.isDevelopment) {
        result = spawn.sync(
          "rearguard",
          [
            ...srcipts["build:release"].replace("rearguard ", "").split(" "),
            ...(needUpdateBuildTime ? ["--needUpdateBuildTime"] : []),
          ],
          {
            cwd: CWD,
            encoding: "utf8",
            stdio: "inherit",
          },
        );
      }

      if (envConfig.isDevelopment) {
        result = spawn.sync(
          "rearguard",
          [
            ...srcipts.build.replace("rearguard ", "").split(" "),
            ...(needUpdateBuildTime ? ["--needUpdateBuildTime"] : []),
          ],
          {
            cwd: CWD,
            encoding: "utf8",
            stdio: "inherit",
          },
        );
      }
    }

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
  }

  console.log(chalk.green(`[ ${rearguardConfig.pkg.name} ][ BUILD ][ END ]`));
  console.log("");
}
