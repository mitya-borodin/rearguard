import chalk from "chalk";
import { execSync } from "child_process";
import * as spawn from "cross-spawn";
import del from "del";
import * as moment from "moment";
import * as path from "path";
import { build_intermediate_dependencies } from "../components/build_intermediate_dependencies";
import { prepare_assembly_for_deployment } from "../components/prepare_assembly_for_deployment";
import { install_declared_deps } from "../components/project_deps/install_declared_deps";
import { install_dev_deps } from "../components/project_deps/install_dev_deps";
import { ordering_project_deps } from "../components/project_deps/ordering_project_deps";
import { sync_with_linked_modules } from "../components/project_deps/sync_with_linked_modules";
import { show_docker_commands } from "../components/show_docker_commands";
import { tsc_bin, tslint_bin } from "../config/bin";
import { buildStatusConfig } from "../config/buildStatus";
import { envConfig } from "../config/env";
import { prettierConfig } from "../config/prettier";
import { rearguardConfig } from "../config/rearguard";
import { tsLintConfig } from "../config/tslint";
import { typescriptConfig } from "../config/typescript";
import { DIST_DIR_NAME } from "../const";
import { backEndDockerfile } from "../meta/backEndDockerfile";
import { dockerIgnore } from "../meta/dockerignore";
import { editorConfig } from "../meta/editorConfig";
import { examples } from "../meta/examples";
import { gitIgnore } from "../meta/gitignore";
import { npmrc } from "../meta/Npmrc";

async function build_node_server() {
  console.log("");
  await build_intermediate_dependencies(envConfig, rearguardConfig);

  // ! Config file
  typescriptConfig.init(true);
  tsLintConfig.init(true);
  editorConfig.init(envConfig, true);
  prettierConfig.init(true);
  npmrc.init(envConfig, true);

  // ! Meta files init
  dockerIgnore.init(envConfig, true);
  gitIgnore.init(envConfig, true);

  // ! Docker config
  backEndDockerfile.init(envConfig);

  // ! Examples
  examples.init(envConfig, true);

  console.log("");

  await install_declared_deps(envConfig);
  await install_dev_deps(envConfig);
  await ordering_project_deps(envConfig);
  await sync_with_linked_modules(envConfig);

  console.log(chalk.bold.blue(`[ BUILD_NODE_SERVER ][ START ]`));
  console.log("");

  // ! REMOVE DIST DIRECTORY
  const paths = await del([path.resolve(process.cwd(), DIST_DIR_NAME)]);

  for (const item of paths) {
    console.log(chalk.gray(`[ ${rearguardConfig.pkg.name} ][ REMOVE ][ ${item} ]`));
  }

  console.log("");

  const startTime = moment();

  // tslint:disable-next-line: variable-name
  const tslint_command = `${tslint_bin} -c tslint.json 'src/**/*.ts' 'bin/**/*.ts' --fix`;

  console.log(chalk.white(tslint_command));
  console.log("");

  execSync(tslint_command, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "inherit",
  });

  const result = spawn.sync(
    tsc_bin,
    [
      "--project",
      path.resolve(process.cwd(), "tsconfig.json"),
      "--rootDir",
      path.resolve(process.cwd(), ""),
      "--outDir",
      path.resolve(process.cwd(), DIST_DIR_NAME),
      "--module",
      "commonjs",
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: "inherit",
    },
  );

  prepare_assembly_for_deployment(rearguardConfig, DIST_DIR_NAME);

  // ! Обработка сигнала процесса
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

  buildStatusConfig.last_build_time = moment();

  console.log("");
  console.log(chalk.bold.blue(`[ BUILD_NODE_SERVER ][ END ][ ${moment().diff(startTime, "milliseconds")} ms ]`));
  console.log("");

  show_docker_commands(rearguardConfig);
}

build_node_server();
