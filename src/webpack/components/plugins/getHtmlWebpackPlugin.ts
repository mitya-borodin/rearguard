import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as webpack from "webpack";
import { getBundleIntrospections } from "../../../components/procedures/getBundleIntrospection";
import { RearguardConfig } from "../../../configs/RearguardConfig";
import {
  getDLLAssetsPath,
  getDLLRuntimeName,
  getLIBRuntimeName,
  getPublicDirPath,
} from "../../../helpers/bundleNaming";
import { BundleIntrospection } from "../../../interfaces/BundleIntrospection";

class ComputeDataForHWP {
  private CWD: string;
  private isDevelopment: boolean;
  private rearguardConfig: RearguardConfig;

  constructor(CWD: string, isDevelopment: boolean) {
    this.CWD = CWD;
    this.isDevelopment = isDevelopment;
    this.rearguardConfig = new RearguardConfig(CWD);

    this.apply = this.apply.bind(this);
  }

  public apply(compiler: webpack.Compiler): void {
    compiler.hooks.compilation.tap("compute_data_for_html_webpack_plugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
        "compute_data_for_html_webpack_plugin", // <-- Set a meaningful name here for stacktraces
        async (
          data: {
            assets: {
              publicPath: string;
              js: string[];
              css: string[];
              favicon?: string | undefined;
              manifest?: string | undefined;
            };
            outputName: string;
          },
          callback: (...args: any[]) => void,
        ): Promise<void> => {
          const snakeName = this.rearguardConfig.getSnakeName();
          const dllAssetsPath = getDLLAssetsPath(this.CWD, snakeName, this.isDevelopment);
          const willLoadOnDemand = this.rearguardConfig.willLoadOnDemand();

          const bundleIntrospection: BundleIntrospection[] = await getBundleIntrospections(
            this.CWD,
            this.isDevelopment,
          );
          const assets: { js: string[]; css: [] } = { js: [], css: [] };

          for (const {
            hasDll,
            hasBrowserLib,
            willLoadOnDemand,
            assetsPath,
            pkgSnakeName,
          } of bundleIntrospection) {
            if (!willLoadOnDemand) {
              if (hasDll && fs.existsSync(assetsPath.dll)) {
                assets.js.push(require(assetsPath.dll)[getDLLRuntimeName(pkgSnakeName)].js);
              }

              if (hasBrowserLib && fs.existsSync(assetsPath.lib)) {
                assets.js.push(require(assetsPath.lib)[getLIBRuntimeName(pkgSnakeName)].js);
              }
            }
          }

          if (!willLoadOnDemand && fs.existsSync(dllAssetsPath)) {
            assets.js.push(require(dllAssetsPath)[getDLLRuntimeName(snakeName)].js);
          }

          // Manipulate the content
          data.assets.js = [...assets.js, ...data.assets.js];

          console.log(chalk.bold.green("[ HtmlWebpackPlugin ][ BUILD ][ index.html ]"));
          for (const css of data.assets.css) {
            console.log(chalk.green(`[ CSS ][ ${css} ]`));
          }
          for (const js of data.assets.js) {
            console.log(chalk.green(`[ JS ][ ${js} ]`));
          }
          console.log("");

          // Tell webpack to move on
          callback(null, data);
        },
      );
    });
  }
}

export const getHtmlWebpackPlugin = (CWD: string, isDevelopment: boolean): webpack.Plugin[] => {
  return [
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: false,
      template: path.resolve(CWD, getPublicDirPath(CWD), "index.html"),
      meta: { viewport: "width=device-width, initial-scale=1, shrink-to-fit=no" },
    }),
    new ComputeDataForHWP(CWD, isDevelopment),
  ];
};
