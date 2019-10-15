import chalk from "chalk";
import * as webpack from "webpack";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { getWebpackStats } from "../../webpack/components/getWebpackStats";
import { getAppWebpackConfig } from "../../webpack/webpack.config.app";

export const buildBrowserApp = async (
  CWD: string,
  options: BuildExecutorOptions,
): Promise<void> => {
  if (options.only_dev) {
    console.log("");
    console.log(chalk.bold.blue(`[ BROWSER_APP ][ ASSEMBLY FOR DEVELOPMENT ]`));
    console.log("");

    process.env.NODE_ENV = "development";

    const devAppWebpackConfig: webpack.Configuration = await getAppWebpackConfig(
      CWD,
      true,
      true,
      options.debug,
    );

    await new Promise((resolve, reject): void => {
      webpack(devAppWebpackConfig).run((err: Error, stats: webpack.Stats) => {
        if (err) {
          reject(err);
        } else {
          console.info(stats.toString(getWebpackStats(CWD)));

          resolve();
        }
      });
    });
  } else {
    console.log(chalk.bold.blue(`[ BROWSER_APP ][ ASSEMBLY FOR PRODUCTION ]`));
    console.log("");

    process.env.NODE_ENV = "production";

    const prodAppWebpackConfig: webpack.Configuration = await getAppWebpackConfig(
      CWD,
      false,
      true,
      options.debug,
    );

    await new Promise((resolve, reject): void => {
      webpack(prodAppWebpackConfig).run((err: Error, stats: webpack.Stats) => {
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
};
