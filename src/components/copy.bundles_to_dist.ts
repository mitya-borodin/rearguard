/* import chalk from "chalk";
import * as copy from "copy";
import * as moment from "moment";
import * as path from "path";
import { dist_dir_name, dll_bundle_dirname, isDebug, lib_bundle_dirname, root } from "./target.config";

export async function copy_bundles_to_dist() {
  console.log(chalk.bold.blue(`=========COPY_BUNDLE_TO_DIST===========`));
  const startTime = moment();
  console.log(chalk.bold.blue(`[ COPY_BUNDLE_TO_DIST ][ RUN ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log("");

  await new Promise((resolve, reject) => {
    copy(
      [`${path.resolve(root, dll_bundle_dirname)}/**`],
      path.resolve(root, dist_dir_name),
      (error: any, items: any[]) => {
        if (!error) {
          if (isDebug) {
            for (const item of items) {
              console.log(chalk.white(`[ COPY_BUNDLE_TO_DIST ][ DLL ]`), chalk.bold.blue(item.path));
            }
          } else {
            console.log(chalk.white(`[ COPY_BUNDLE_TO_DIST ][ DLL ][ ${items.length} FILES ]`));
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
      [`${path.resolve(root, lib_bundle_dirname)}/**`],
      path.resolve(root, dist_dir_name),
      (error: any, items: any[]) => {
        if (!error) {
          if (isDebug) {
            for (const item of items) {
              console.log(chalk.white(`[ COPY_BUNDLE_TO_DIST ][ LIBRARY ]`), chalk.bold.blue(item.path));
            }
          } else {
            console.log(chalk.white(`[ COPY_BUNDLE_TO_DIST ][ LIBRARY ][ ${items.length} FILES ]`));
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
  console.log(
    chalk.bold.blue(
      `[ COPY_BUNDLE_TO_DIST ][ COPY_TIME ][ ${endTime.diff(startTime, "milliseconds")} ][ millisecond ]`,
    ),
  );
  console.log(chalk.bold.blue(`[ COPY_BUNDLE_TO_DIST ][ DONE ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log(chalk.bold.blue(`=======================================`));
  console.log("");
}
 */
