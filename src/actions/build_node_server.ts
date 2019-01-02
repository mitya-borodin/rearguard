import chalk from "chalk";
import * as spawn from "cross-spawn";
import * as moment from "moment";
import * as path from "path";
import { install_declared_deps } from "../components/project_deps/install_declared_deps";
import { ordering_project_deps } from "../components/project_deps/ordering_project_deps";
import { sync_with_linked_modules } from "../components/project_deps/sync_with_linked_modules";
import { prettierConfig } from "../config/prettier";
import { tsLintConfig } from "../config/tslint";
import { typescriptConfig } from "../config/typescript";
import { dockerIgnore } from "../meta/dockerignore";
import { editorConfig } from "../meta/editorConfig";
import { gitIgnore } from "../meta/gitignore";
import { npmrc } from "../meta/Npmrc";

async function build_node_server() {
  // Config file
  typescriptConfig.init(true);
  tsLintConfig.init(true);
  prettierConfig.init(true);

  // Meta files init
  dockerIgnore.init(true);
  gitIgnore.init(true);
  editorConfig.init(true);
  npmrc.init(true);

  console.log("");

  await install_declared_deps();
  await ordering_project_deps();
  await sync_with_linked_modules();

  console.log(chalk.bold.blue(`[ BUILD_NODE_SERVER ][ START ]`));
  const startTime = moment();
  console.log("");

  const result = spawn.sync(
    "tsc",
    [
      "--project",
      path.resolve(process.cwd(), "tsconfig.json"),
      "--rootDir",
      path.resolve(process.cwd(), ""),
      "--outDir",
      path.resolve(process.cwd(), "dist"),
      "--module",
      "commonjs",
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: "inherit",
    },
  );

  if (result.signal) {
    if (result.signal === "SIGKILL") {
      console.log(
        chalk.bold.red(
          "The tsc failed because the process exited too early. " +
            "This probably means the system ran out of memory or someone called `kill -9` on the process.",
        ),
      );

      process.exit(1);
    } else if (result.signal === "SIGTERM") {
      console.log(
        chalk.bold.red(
          "The tsc failed because the process exited too early. " +
            "Someone might have called `kill` or `killall`, or the system could be shutting down.",
        ),
      );

      process.exit(1);
    }
  }

  console.log("");
  console.log(chalk.bold.blue(`[ BUILD_NODE_SERVER ][ END ][ ${moment().diff(startTime, "milliseconds")} ms ]`));
  console.log("");
}

build_node_server();
