import chalk from "chalk";
import { execSync } from "child_process";
import * as spawn from "cross-spawn";
import { build_intermediate_dependencies } from "../components/build_intermediate_dependencies";
import { install_declared_deps } from "../components/project_deps/install_declared_deps";
import { install_dev_deps } from "../components/project_deps/install_dev_deps";
import { ordering_project_deps } from "../components/project_deps/ordering_project_deps";
import { sync_with_linked_modules } from "../components/project_deps/sync_with_linked_modules";
import { envConfig } from "../config/env";
import { prettierConfig } from "../config/prettier";
import { rearguardConfig } from "../config/rearguard";
import { tsLintConfig } from "../config/tslint";
import { typescriptConfig } from "../config/typescript";
import { dockerIgnore } from "../meta/dockerignore";
import { editorConfig } from "../meta/editorConfig";
import { gitIgnore } from "../meta/gitignore";
import { npmrc } from "../meta/Npmrc";

async function start_node_server() {
  await build_intermediate_dependencies(envConfig, rearguardConfig);

  // Config file
  typescriptConfig.init(true);
  tsLintConfig.init(true);
  editorConfig.init(envConfig, true);
  prettierConfig.init(true);
  npmrc.init(envConfig, true);

  // Meta files init
  dockerIgnore.init(envConfig, true);
  gitIgnore.init(envConfig, true);

  console.log("");

  await install_declared_deps(envConfig);
  await install_dev_deps(envConfig);
  await ordering_project_deps(envConfig);
  await sync_with_linked_modules(envConfig);

  console.log(chalk.bold.blue(`[ START_NODE_SERVER ]`));
  console.log("");

  // tslint:disable-next-line: variable-name
  const tslint_command = `tslint -c tslint.json 'src/**/*.ts' 'bin/**/*.ts' --fix`;

  console.log(chalk.white(tslint_command));
  console.log("");

  execSync(tslint_command, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "inherit",
  });

  // tslint:disable-next-line: variable-name
  const ts_node_dev_command = `ts-node-dev --prefer-ts --type-check --respawn ./bin/www.ts`;

  console.log(chalk.white(ts_node_dev_command));
  console.log("");

  const result = spawn.sync("ts-node-dev", ["--prefer-ts", "--type-check", "--respawn", "./bin/www.ts"], {
    encoding: "utf8",
    stdio: "inherit",
  });

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

  console.log("");
}

start_node_server();
