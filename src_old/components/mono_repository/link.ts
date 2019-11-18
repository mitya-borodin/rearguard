import chalk from "chalk";
import * as spawn from "cross-spawn";
import * as path from "path";
import { envConfig } from "../../config/env";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";

export async function link(CWD: string) {
  const { pkg } = new RearguardConfig(envConfig, path.resolve(CWD, "package.json"));
  console.log(chalk.bold.green(`[ ${pkg.name} ][ LINK ]`));
  console.log("");

  const result = spawn.sync("npm", ["link"], {
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

  console.log(chalk.green(`[ ${pkg.name} ][ LINK ][ END ]`));
  console.log("");
}
