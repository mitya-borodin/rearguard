import chalk from "chalk";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import { getWebpackDevServerConfig } from "../../webpack/components/getWebpackDevServerConfig";
import { getAppWebpackConfig } from "../../webpack/webpack.config.app";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { pubSub, events } from "../../helpers/pubSub";

export const runWebpackDevServer = async (
  CWD: string,
  isDevelopment: boolean,
  isBuild: boolean,
  isDebug: boolean,
): Promise<void> => {
  console.log(chalk.bold.blue(`[ RUN WEBPACK-DEV-SERVER ]`));
  console.log("");

  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  const webpackConfig = await getAppWebpackConfig(CWD, isDevelopment, isBuild, isDebug);
  const webpackDevServerConfig = await getWebpackDevServerConfig(CWD);
  const compiler = webpack(webpackConfig);

  const wds: any = new WDS(compiler, webpackDevServerConfig);

  const { host, port } = await rearguardLocalConfig.getWDSConfig();

  pubSub.on(events.SYNCED, () => {
    // ! middleware isn't describing in type declarations.
    wds.middleware.invalidate();
  });

  wds.listen(port, host, () => {
    console.log(chalk.cyan(`[ WEBPACK-DEV-SERVER ][ LAUNCHED ]`));
    console.log(chalk.cyan(`[ HOSTNAME: https://${host}:${port} ]`));
    console.log("");
  });

  // TODO сделать единственный метод для shutdown.
  process.on("SIGINT", () => {
    wds.close();
    process.exit(0);
  });
  process.on("exit", () => {
    wds.close();
  });
  process.on("uncaughtException", () => {
    wds.close();
    process.exit(1);
  });
  process.on("unhandledRejection", () => {
    wds.close();
    process.exit(1);
  });
};
