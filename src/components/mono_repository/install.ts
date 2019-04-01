import chalk from "chalk";
import * as spawn from "cross-spawn";
import * as path from "path";
import { envConfig } from "../../config/env";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";
import { install_declared_deps } from "../project_deps/install_declared_deps";

export async function install(CWD: string) {
  const { pkg } = new RearguardConfig(envConfig, path.resolve(CWD, "package.json"));

  console.log(chalk.bold.green(`[ ${pkg.name} ][ INSTALL ]`));
  console.log("");

  // ! Необходимо запомнить текущее значение, для того чтобы его
  // ! восстановить в конце процедуры.

  const NODE_ENV = process.env.NODE_ENV;

  process.env.NODE_ENV = "development";

  await install_declared_deps(envConfig, CWD);

  const result = spawn.sync("npm", ["install"], {
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

  process.env.NODE_ENV = NODE_ENV;

  console.log(chalk.green(`[ ${pkg.name} ][ INSTALL ][ END ]`));
  console.log("");
}
