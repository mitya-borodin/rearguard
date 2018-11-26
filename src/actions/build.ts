import chalk from "chalk";
import * as spawn from "cross-spawn";
import * as moment from "moment";
import * as webpack from "webpack";
import { initProject } from "../components/init_project";
import { copy_bundles_to_dist } from "../components/project_deps/copy_bundles_to_dist";
import { envConfig } from "../config/env";
import { get_stats } from "../webpack/components/get_stats";
import { dll_WP_config } from "../webpack/webpack.config.dll";
import { library_WP_config } from "../webpack/webpack.config.lib";
import { main_WS_config } from "../webpack/webpack.config.main";

async function build() {
  await initProject();

  console.log(chalk.bold.blue(`==================BUILD================`));
  const startTime = moment();
  console.log("");

  if (!(envConfig.has_dll || envConfig.has_ui_lib || envConfig.has_node_lib)) {
    // Сборка front-end проекта.

    await new Promise((resolve, reject) => {
      webpack(main_WS_config()).run(async (err: any, stats: any) => {
        if (err) {
          reject(err);
        }

        console.info(stats.toString(get_stats()));

        await copy_bundles_to_dist();

        resolve();
      });
    });

    console.log("");
    console.log("=======================================");
    console.log("");
  }

  if (envConfig.has_dll) {
    await new Promise((resolve, reject) => {
      webpack(dll_WP_config()).run(async (err: any, stats: any) => {
        if (err) {
          reject(err);
        }

        console.info(stats.toString(get_stats()));

        resolve();
      });
    });

    console.log("");
    console.log("=======================================");
    console.log("");
  }

  if (envConfig.has_ui_lib) {
    await new Promise((resolve, reject) => {
      webpack(library_WP_config()).run(async (err: any, stats: any) => {
        if (err) {
          reject(err);
        }

        console.info(stats.toString(get_stats()));

        resolve();
      });
    });

    console.log("");
    console.log("=======================================");
    console.log("");
  }

  if (envConfig.has_node_lib) {
    const result = spawn.sync("tsc", [], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: "inherit",
    });

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
    console.log("=======================================");
    console.log("");
  }

  console.log(chalk.bold.blue(`[ SPEED ][ ${moment().diff(startTime, "milliseconds")} ms ]`));
  console.log(chalk.bold.blue(`=======================================`));
  console.log("");
}

build();
