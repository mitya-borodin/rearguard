import chalk from "chalk";
import * as spawn from "cross-spawn";
import * as moment from "moment";
import * as path from "path";
import * as webpack from "webpack";
import { build_intermediate_dependencies } from "../components/build_intermediate_dependencies";
import { initProject } from "../components/init_project";
import { copy_bundles_to_dist } from "../components/project_deps/copy_bundles_to_dist";
import { show_docker_commands } from "../components/show_docker_commands";
import { create_workbox } from "../components/workbox";
import { tsc_bin } from "../config/bin";
import { buildStatusConfig } from "../config/buildStatus";
import { envConfig } from "../config/env";
import { rearguardConfig } from "../config/rearguard";
import { examples } from "../meta/examples";
import { frontEndDockerfile } from "../meta/frontEndDockerfile";
import { nginxConfig } from "../meta/nginxConfig";
import { get_stats } from "../webpack/components/get_stats";
import { dll_WP_config } from "../webpack/webpack.config.dll";
import { library_WP_config } from "../webpack/webpack.config.lib";
import { main_WS_config } from "../webpack/webpack.config.main";

async function build_node_lib() {
  console.log(chalk.bold.blue(`[ TYPESCRIPT_COMPILE ][ START ]`));
  console.log("");

  const startTime = moment();

  const result = spawn.sync(
    tsc_bin,
    [
      "--project",
      path.resolve(process.cwd(), "tsconfig.json"),
      "--rootDir",
      path.resolve(process.cwd(), "src"),
      "--outDir",
      path.resolve(process.cwd(), "lib"),
      "--module",
      "commonjs",
      "--declaration",
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: "inherit",
    },
  );

  if (result.error) {
    console.error(result.error);

    process.exit(1);
  }

  // ! Обработка сигнала.
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
  console.log(chalk.bold.blue(`[ TYPESCRIPT_COMPILE ][ END ][ ${moment().diff(startTime, "milliseconds")} ms ]`));
  console.log("");
}

async function build() {
  if (envConfig.has_dll) {
    console.log(chalk.bold.blue(`[ BUILD_DLL ][ START ]`));

    const startTime = moment();

    await new Promise((resolve, reject) => {
      webpack(dll_WP_config(envConfig, rearguardConfig)).run(async (err: any, stats: any) => {
        if (err) {
          reject(err);
        }

        console.info(stats.toString(get_stats(envConfig)));

        resolve();
      });
    });

    console.log("");
    console.log(chalk.bold.blue(`[ BUILD_DLL ][ END ][ ${moment().diff(startTime, "milliseconds")} ms ]`));
    console.log("");
  }

  if (envConfig.has_browser_lib) {
    console.log(chalk.bold.blue(`[ BUILD_LIBRARY ][ START ]`));
    const startTime = moment();

    await new Promise((resolve, reject) => {
      webpack(library_WP_config(envConfig, rearguardConfig)).run(async (err: any, stats: any) => {
        if (err) {
          reject(err);
        }

        console.info(stats.toString(get_stats(envConfig)));

        resolve();
      });
    });

    console.log("");
    console.log(chalk.bold.blue(`[ BUILD_LIBRARY ][ END ][ ${moment().diff(startTime, "milliseconds")} ms ]`));
    console.log("");
  }

  if (envConfig.is_application) {
    console.log(chalk.bold.blue(`[ BUILD_PROJECT ][ START ]`));
    const startTime = moment();

    // ! Docker config
    frontEndDockerfile.init(envConfig);
    // ! Nginx config
    nginxConfig.init(envConfig);
    // ! Examples
    examples.init(envConfig, true);
    // Сборка front-end проекта.

    await new Promise((resolve, reject) => {
      webpack(main_WS_config(envConfig, rearguardConfig)).run(async (err: any, stats: any) => {
        if (err) {
          reject(err);
        }

        console.info(stats.toString(get_stats(envConfig)));
        console.log("");

        await copy_bundles_to_dist(envConfig);
        await create_workbox(envConfig);

        resolve();
      });
    });

    console.log("");
    console.log(chalk.bold.blue(`[ BUILD_PROJECT ][ END ][ ${moment().diff(startTime, "milliseconds")} ms ]`));
    console.log("");

    show_docker_commands(rearguardConfig);
  }
}

async function run() {
  await build_intermediate_dependencies(envConfig, rearguardConfig);

  buildStatusConfig.start();

  await initProject();

  if (envConfig.isBuildBoth) {
    process.env.NODE_ENV = "development";
    await build();

    process.env.NODE_ENV = "production";
    await build();
  } else {
    await build();
  }

  if (envConfig.has_node_lib) {
    await build_node_lib();

    if (!envConfig.has_dll && !envConfig.has_browser_lib && !envConfig.is_application) {
      buildStatusConfig.last_build_time = moment();
    }
  }

  buildStatusConfig.end();
}

run();