import chalk from "chalk";
import * as moment from "moment";
import * as path from "path";
import * as webpack from "webpack";
import { Stats } from "webpack";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { TypescriptConfig } from "../../configs/TypescriptConfig";
import { DISTRIBUTIVE_DIR_NAME, DLL_BUNDLE_DIR_NAME, LIST_OF_LOAD_ON_DEMAND } from "../../const";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { getWebpackStats } from "../../webpack/components/getWebpackStats";
import { getDLLWebpackConfig } from "../../webpack/webpack.config.dll";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { gitignoreTemplate } from "../../templates/gitignore";

export async function build_browser_dll(options: BuildExecutorOptions): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);
  const typescriptConfig = new TypescriptConfig(CWD);
  const baseUrl = path.resolve(CWD, rearguardConfig.getContext());
  const exclude: string[] = [
    "node_modules",
    path.resolve(CWD, DISTRIBUTIVE_DIR_NAME),
    path.resolve(CWD, DLL_BUNDLE_DIR_NAME),
  ];

  // ! Set status.
  await rearguardLocalConfig.setBuildStatus("in_progress");

  // ! Typescript config for developing and building;
  await typescriptConfig.init(rearguardConfig.isOverwriteTSConfig());
  await typescriptConfig.setBaseUrl(baseUrl);
  await typescriptConfig.setInclude([baseUrl]);
  await typescriptConfig.setExclude(exclude);

  // ! Create .gitignore configuration;
  await gitignoreTemplate.render({
    publish_to_git: rearguardConfig.isPublishToGit(),
    list_for_load_on_demand: LIST_OF_LOAD_ON_DEMAND,
    force: rearguardConfig.isOverwriteGitIgnore(),
  });

  console.log(chalk.bold.blue(`[ BUILD_DLL ][ START ]`));
  console.log("");

  const startTime = moment();

  console.log(chalk.bold.blue(`[ BUILD FOR PRODUCTION ]`));
  console.log("");

  if (!options.only_dev) {
    const prodWebpackConfig: webpack.Configuration = await getDLLWebpackConfig(
      CWD,
      false,
      options.debug,
    );

    await new Promise((resolve, reject): void => {
      webpack(prodWebpackConfig).run((err: Error, stats: Stats) => {
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
  console.log(chalk.bold.blue(`[ BUILD FOR DEVELOPMENT ]`));
  console.log("");

  const devWebpackConfig: webpack.Configuration = await getDLLWebpackConfig(
    CWD,
    true,
    options.debug,
  );

  await new Promise((resolve, reject): void => {
    webpack(devWebpackConfig).run((err: Error, stats: Stats) => {
      if (err) {
        reject(err);
      } else {
        console.info(stats.toString(getWebpackStats(CWD)));

        resolve();
      }
    });
  });

  // ! Set status.
  await rearguardLocalConfig.setBuildStatus("done");

  console.log("");
  console.log(
    chalk.bold.blue(`[ BUILD_DLL ][ END ][ ${moment().diff(startTime, "milliseconds")} ms ]`),
  );
  console.log("");
}
