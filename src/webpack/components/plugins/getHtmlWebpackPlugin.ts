import { isString } from "@rtcts/utils";
import chalk from "chalk";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import fs from "fs";
import webpack from "webpack";
import { getBundleIntrospections } from "../../../components/procedures/getBundleIntrospection";
import { RearguardConfig } from "../../../configs/RearguardConfig";
import {
  getDLLAssetsPath,
  getDLLRuntimeName,
  getLIBRuntimeName,
  getPublicDirPath,
} from "../../../helpers/bundleNaming";
import { BundleIntrospection } from "../../../interfaces/BundleIntrospection";
import { InterpolateHtmlPlugin } from "./InterpolateHtmlPlugin";

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
          const assets: { js: string[]; css: string[] } = { js: [], css: [] };

          for (const {
            hasDll,
            hasBrowserLib,
            willLoadOnDemand,
            assetsPath,
            pkgSnakeName,
          } of bundleIntrospection) {
            if (!willLoadOnDemand) {
              if (hasDll && fs.existsSync(assetsPath.dll)) {
                const source = require(assetsPath.dll)[getDLLRuntimeName(pkgSnakeName)];

                if (isString(source.js)) {
                  assets.js.push(source.js);
                }
                if (isString(source.css)) {
                  assets.css.push(source.css);
                }
              }

              if (hasBrowserLib && fs.existsSync(assetsPath.lib)) {
                const source = require(assetsPath.lib)[getLIBRuntimeName(pkgSnakeName)];

                if (isString(source.js)) {
                  assets.js.push(source.js);
                }
                if (isString(source.css)) {
                  assets.css.push(source.css);
                }
              }
            }
          }

          if (!willLoadOnDemand && fs.existsSync(dllAssetsPath)) {
            assets.js.push(require(dllAssetsPath)[getDLLRuntimeName(snakeName)].js);
          }

          // Manipulate the content
          data.assets.js = [...assets.js, ...data.assets.js];
          data.assets.css = [...assets.css, ...data.assets.css];

          console.log("");
          console.log("");
          console.log(chalk.bold.green("[ HtmlWebpackPlugin ][ BUILD ][ index.html ]"));
          for (const css of data.assets.css) {
            console.log(chalk.green(`[ CSS ][ ${css} ]`));
          }
          for (const js of data.assets.js) {
            console.log(chalk.green(`[ JS ][ ${js} ]`));
          }
          // Tell webpack to move on
          callback(null, data);
        },
      );
    });
  }
}

export const getHtmlWebpackPlugin = (CWD: string, isDevelopment: boolean): webpack.Plugin[] => {
  const rearguardConfig = new RearguardConfig(CWD);
  const isBrowser = rearguardConfig.isBrowser();
  const isApp = rearguardConfig.isApp();
  const { publicPath } = rearguardConfig.getOutput();

  let template = path.resolve(CWD, getPublicDirPath(CWD), "index.html");

  if (!(isBrowser && isApp)) {
    template = path.resolve(__dirname, "../../../templates/indexHtml", "index.html");
  }

  return [
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template,
        },
        !isDevelopment
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined,
      ),
    ),
    new ComputeDataForHWP(CWD, isDevelopment),
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL: publicPath,
      // You can pass any key-value pairs, this was just an example.
      // WHATEVER: 42 will replace %WHATEVER% with 42 in index.html.
    }),
  ];
};
