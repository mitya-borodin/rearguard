import chalk from "chalk";
import webpack from "webpack";
import WDS from "webpack-dev-server";
import { getWebpackDevServerConfig } from "../../webpack/components/getWebpackDevServerConfig";
import { getAppWebpackConfig } from "../../webpack/webpack.config.app";
import { RearguardDevConfig } from "../../configs/RearguardDevConfig";
import { pubSub, events } from "../../helpers/pubSub";

export const runWebpackDevServer = async (
  CWD: string,
  isDevelopment: boolean,
  isBuild: boolean,
  isDebug: boolean,
): Promise<void> => {
  console.log(chalk.bold.blue(`[ RUN WEBPACK-DEV-SERVER ]`));
  console.log("");

  const rearguardLocalConfig = new RearguardDevConfig(CWD);

  const webpackConfig = await getAppWebpackConfig(CWD, isDevelopment, isBuild, isDebug);
  const webpackDevServerConfig = await getWebpackDevServerConfig(CWD, isDevelopment);
  const compiler = webpack(webpackConfig);

  const wds: any = new WDS(compiler, webpackDevServerConfig);

  const { host, port } = await rearguardLocalConfig.getWDSConfig();

  pubSub.on(events.SYNCED, () => {
    console.log("[ WDS ][ INVALIDATED ]");
    console.log("");

    wds.middleware.invalidate();
  });

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

  wds.listen(port, host);
};
