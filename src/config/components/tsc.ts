import chalk from "chalk";
import * as spawn from "cross-spawn";
import { root } from "./target.config";

export function tsc() {
  const result = spawn.sync("tsc", [], {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit",
  });

  if (result.signal) {
    if (result.signal === "SIGKILL") {
      console.log(
        chalk.red(
          "The tsc failed because the process exited too early. This probably means the system ran out of memory or someone called `kill -9` on the process.",
        ),
      );

      process.exit(1);
    } else if (result.signal === "SIGTERM") {
      console.log(
        chalk.bold.red(
          "The tsc failed because the process exited too early. Someone might have called `kill` or `killall`, or the system could be shutting down.",
        ),
      );

      process.exit(1);
    }
  }
}
