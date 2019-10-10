import chalk from "chalk";
import * as moment from "moment";
import * as webpack from "webpack";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";

export async function build_browser_dll(options: BuildExecutorOptions): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);

  console.log("BUILD_DLL", CWD || rearguardConfig || options);

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
  console.log(
    chalk.bold.blue(`[ BUILD_DLL ][ END ][ ${moment().diff(startTime, "milliseconds")} ms ]`),
  );
  console.log("");
}
