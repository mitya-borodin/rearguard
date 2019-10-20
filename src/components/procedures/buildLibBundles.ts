import chalk from "chalk";
import * as webpack from "webpack";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { getWebpackStats } from "../../webpack/components/getWebpackStats";
import { getLibWebpackConfig } from "../../webpack/webpack.config.lib";

export const buildLibBundles = async (
  CWD: string,
  options: BuildExecutorOptions,
): Promise<void> => {
  if (!options.only_dev) {
    console.log(chalk.bold.blue(`[ LIB ][ BUNDLE ][ ASSEMBLY FOR PRODUCTION ]`));
    console.log("");

    process.env.NODE_ENV = "production";

    const prodLibWebpackConfig: webpack.Configuration = await getLibWebpackConfig(
      CWD,
      false,
      options.debug,
      options.need_update_build_time,
    );

    await new Promise((resolve, reject): void => {
      webpack(prodLibWebpackConfig).run((err: Error, stats: webpack.Stats) => {
        if (err) {
          reject(err);
        } else {
          console.info(stats.toString(getWebpackStats(CWD)));

          resolve();
        }
      });
    });
  }

  console.log("");
  console.log(chalk.bold.blue(`[ LIB ][ BUNDLE ][ ASSEMBLY FOR DEVELOPMENT ]`));
  console.log("");

  process.env.NODE_ENV = "development";

  const devLibWebpackConfig: webpack.Configuration = await getLibWebpackConfig(
    CWD,
    true,
    options.debug,
    options.need_update_build_time,
  );

  await new Promise((resolve, reject): void => {
    webpack(devLibWebpackConfig).run((err: Error, stats: webpack.Stats) => {
      if (err) {
        reject(err);
      } else {
        console.info(stats.toString(getWebpackStats(CWD)));

        resolve();
      }
    });
  });
  console.log("");
};
