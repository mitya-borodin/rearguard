import fs from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import webpack from "webpack";
import { getBundleIntrospections } from "../../../components/procedures/getBundleIntrospection";
import { RearguardConfig } from "../../../configs/RearguardConfig";
import {
  getDLLAssetsPath,
  getPublicDirPath,
  getDLLRuntimeName,
  getLIBRuntimeName,
} from "../../../helpers/bundleNaming";
import { BundleIntrospection } from "../../../interfaces/BundleIntrospection";
import { InlineChunkHtmlPlugin } from "./InlineChunkHtmlPlugin";
import { InterpolateHtmlPlugin } from "./InterpolateHtmlPlugin";
import { isString } from "@rtcts/utils";
import chalk from "chalk";
import { getENV } from "../../../components/procedures/getENV";
import { promisify } from "util";

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);

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
              if (hasDll && (await exists(assetsPath.dll))) {
                const content = await readFile(assetsPath.dll, { encoding: "utf-8" });
                const source = JSON.parse(content);
                const dll = source[getDLLRuntimeName(pkgSnakeName)];

                if (isString(dll.js)) {
                  assets.js.push(dll.js);
                }
                if (isString(dll.css)) {
                  assets.css.push(dll.css);
                }
              }

              if (hasBrowserLib && (await exists(assetsPath.lib))) {
                const content = await readFile(assetsPath.lib, { encoding: "utf-8" });
                const source = JSON.parse(content);
                const lib = source[getLIBRuntimeName(pkgSnakeName)];

                if (isString(lib.js)) {
                  assets.js.push(lib.js);
                }
                if (isString(lib.css)) {
                  assets.css.push(lib.css);
                }
              }
            }
          }

          if (!willLoadOnDemand && (await exists(dllAssetsPath))) {
            const content = await readFile(dllAssetsPath, { encoding: "utf-8" });
            const source = JSON.parse(content);
            const dll = source[getDLLRuntimeName(snakeName)];

            assets.js.push(dll.js);
          }

          // Manipulate the content
          data.assets.js = [...assets.js, ...data.assets.js];
          data.assets.css = [...assets.css, ...data.assets.css];

          console.log("");
          console.log("");
          console.log(chalk.bold.green("[ HtmlWebpackPlugin ][ BUILD ][ index.html ]"));
          console.log("");

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
  const rearguardConfig = new RearguardConfig(CWD);
  const isBrowser = rearguardConfig.isBrowser();
  const isApp = rearguardConfig.isApp();
  const { publicPath } = rearguardConfig.getOutput();

  let template = path.resolve(CWD, getPublicDirPath(CWD), "index.html");

  if (!(isBrowser && isApp)) {
    template = path.resolve(__dirname, "../../../templates/indexHtml", "index.html");
  }

  let PUBLIC_URL: string = path.normalize(publicPath);

  if (PUBLIC_URL[PUBLIC_URL.length - 1] === "/") {
    PUBLIC_URL = PUBLIC_URL.slice(0, -1);
  }

  if (isDevelopment) {
    PUBLIC_URL = "";
  }

  return [
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template,
        },
        {},
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

    // Inlines the webpack runtime script. This script is too small to warrant
    // a network request.
    // https://github.com/facebook/create-react-app/issues/5358
    ...(isDevelopment ? [] : [new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/])]),

    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL,
      ...getENV(CWD).interpolationHTML,
      // You can pass any key-value pairs, this was just an example.
      // WHATEVER: 42 will replace %WHATEVER% with 42 in index.html.
    }),
  ];
};
