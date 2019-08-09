import chalk from "chalk";
import { resolve } from "path";
import * as workboxBuild from "workbox-build";
import { get_output_path } from "../helpers";
import { IEnvConfig } from "../interfaces/config/IEnvConfig";

const generateSW = workboxBuild.generateSW;

export async function create_workbox(envConfig: IEnvConfig): Promise<void> {
  console.log(chalk.bold.yellowBright(`[ WORKBOX ][ START ]`));

  const swDest = resolve(get_output_path(), "sw.js");
  // tslint:disable-next-line: variable-name
  const glob_for_files = "*.{js,css,html,jpeg,jpg,svg,gif,png,ttf}";

  await generateSW({
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    globDirectory: get_output_path(),
    globPatterns: [`**/${envConfig.isDevelopment ? "dev" : "prod"}/${glob_for_files}`, glob_for_files],
    importWorkboxFrom: "local",
    maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
    navigateFallback: "/",
    skipWaiting: true,
    swDest,
  }).then(({ count, size }: any) => {
    console.log(chalk.bold.yellowBright(`[ SERVICE_WORKER ][ ${swDest} ]`));
    console.log(chalk.bold.yellowBright(`[ PREACHED ][ ${count} ][ FILES ]`));
    console.log(chalk.bold.yellowBright(`[ SIZE ][ ${size / 1024} ][ KB ]`));
  });

  console.log(chalk.bold.yellowBright(`[ WORKBOX ][ END ]`));
  console.log("");
}
