import chalk from "chalk";
import * as webpack from "webpack";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { hasVendorImports } from "./hasVendorImports";
import { getDLLWebpackConfig } from "../../webpack/webpack.config.dll";
import { getWebpackStats } from "../../webpack/components/getWebpackStats";

export const buildDllBundles = async (
  CWD: string,
  options: BuildExecutorOptions,
): Promise<void> => {
  if (await hasVendorImports(CWD)) {
    if (!options.only_dev) {
      console.log(chalk.bold.blue(`[ DLL ][ BUNDLE ][ ASSEMBLY FOR PRODUCTION ]`));
      console.log("");

      process.env.NODE_ENV = "production";

      const prodWebpackConfig: webpack.Configuration = await getDLLWebpackConfig(
        CWD,
        false,
        options.debug,
      );

      await new Promise((resolve, reject): void => {
        webpack(prodWebpackConfig).run((err: Error, stats: webpack.Stats) => {
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
    console.log(chalk.bold.blue(`[ DLL ][ BUNDLE ][ ASSEMBLY FOR DEVELOPMENT ]`));
    console.log("");

    process.env.NODE_ENV = "development";

    const devWebpackConfig: webpack.Configuration = await getDLLWebpackConfig(
      CWD,
      true,
      options.debug,
    );

    await new Promise((resolve, reject): void => {
      webpack(devWebpackConfig).run((err: Error, stats: webpack.Stats) => {
        if (err) {
          reject(err);
        } else {
          console.info(stats.toString(getWebpackStats(CWD)));

          resolve();
        }
      });
    });
    console.log("");
  }
};
