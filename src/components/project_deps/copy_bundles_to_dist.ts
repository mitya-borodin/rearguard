import chalk from "chalk";
import * as copy from "copy";
import * as moment from "moment";
import * as path from "path";
import { envConfig } from "../../config/env";
import { DIST_DIR_NAME, DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME } from "../../const";

export async function copy_bundles_to_dist() {
  if (envConfig.isBuild && !(envConfig.has_dll || envConfig.has_ui_lib || envConfig.has_node_lib)) {
    console.log(chalk.bold.blue(`=========COPY_BUNDLE_TO_DIST===========`));
    const startTime = moment();
    console.log("");

    await new Promise((resolve, reject) => {
      copy(
        [`${path.resolve(process.cwd(), DLL_BUNDLE_DIR_NAME)}/**`],
        path.resolve(process.cwd(), DIST_DIR_NAME),
        (error: any, items: any[]) => {
          if (!error) {
            if (envConfig.isDebug) {
              for (const item of items) {
                console.log(chalk.white(`[ DLL ]`), chalk.bold.blue(item.path));
              }
            } else {
              console.log(chalk.white(`[ DLL ][ ${items.length} FILES ]`));
            }

            resolve();
          } else {
            reject(error);
          }
        },
      );
    });
    await new Promise((resolve, reject) => {
      copy(
        [`${path.resolve(process.cwd(), LIB_BUNDLE_DIR_NAME)}/**`],
        path.resolve(process.cwd(), DIST_DIR_NAME),
        (error: any, items: any[]) => {
          if (!error) {
            if (envConfig.isDebug) {
              for (const item of items) {
                console.log(chalk.white(`[ LIBRARY ]`), chalk.bold.blue(item.path));
              }
            } else {
              console.log(chalk.white(`[ LIBRARY ][ ${items.length} FILES ]`));
            }

            resolve();
          } else {
            reject(error);
          }
        },
      );
    });

    const endTime = moment();

    console.log("");
    console.log(chalk.bold.blue(`[ SPEED ][ ${endTime.diff(startTime, "milliseconds")} ms ]`));
    console.log(chalk.bold.blue(`=======================================`));
    console.log("");
  }
}
