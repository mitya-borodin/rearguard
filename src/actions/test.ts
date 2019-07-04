import chalk from "chalk";
import * as spawn from "cross-spawn";
import * as path from "path";
import { mocha_bin } from "../config/bin";
import { typescriptTestConfig } from "../config/typescript";
import { TESTS_DIR_NAME } from "../const";
import { sync } from "./sync/index";

async function test() {
  await sync();

  typescriptTestConfig.init(true);

  const setup = path.resolve(__dirname, `../components/${TESTS_DIR_NAME}/setup.js`);
  const specs = path.resolve(process.cwd(), `${TESTS_DIR_NAME}/**/*.spec.ts`);

  const result = spawn.sync(mocha_bin, [`--require`, `${setup}`, `${specs}`], { encoding: "utf8", stdio: "inherit" });

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

test();
