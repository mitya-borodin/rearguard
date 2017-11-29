import * as AssetsPlugin from "assets-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as UglifyJSPlugin from "uglifyjs-webpack-plugin";
import * as webpack from "webpack";
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import {context, env, isAnalyze, isDevelopment, isIsomorphic, isTS, onlyServer, servercOutput, tsLintConfigFilePath, typescriptConfigFilePath} from "../target.config";

export const HMR = () => {
  if (isDevelopment) {
    return [
      new webpack.HotModuleReplacementPlugin(),
      // enable HMR globally

      new webpack.NamedModulesPlugin(),
      // prints more readable module names in the browser console on HMR updates
    ];
  }

  return [];
};

// https://webpack.js.org/plugins/commons-chunk-plugin/
export const extractVendors = () => (
  new webpack.optimize.CommonsChunkPlugin({
    minChunks: (module: { resource: string }) => /node_modules/.test(module.resource),
    name: "vendor",
  })
);

export const uglify = () => {
  if (!isDevelopment) {
    return [
      // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
      new UglifyJSPlugin(
        {
          cache: true,
          parallel: true,
        },
      ),
    ];
  }

  return [];
};

// Webpack Bundle Analyzer
// https://github.com/th0r/webpack-bundle-analyzer
export const analyze = (port: number) => {
  if (isAnalyze) {
    return [new BundleAnalyzerPlugin({
      analyzerPort: port,
    })];
  }

  return [];
};

// https://webpack.js.org/plugins/define-plugin/
export const definePlugin = () => (
  new webpack.DefinePlugin({
    "___DEV__": env.__DEV__,
    "process.env.DEBUG": env.DEBUG,
    "process.env.NODE_ENV": env.NODE_ENV,

  })
);

// Emit a file with assets paths
// https://github.com/sporto/assets-webpack-plugin#options
export const assetsPlugin = () => {
  if (isIsomorphic || onlyServer) {
    return [
      new AssetsPlugin({
        filename: "assets.json",
        path: servercOutput,
        prettyPrint: true,
      }),
    ];
  }

  return [];
};

export const htmlWebpackPlugin = () => {
  if (!isIsomorphic) {
    return [
      new HtmlWebpackPlugin({
        filename: "index.html",
        inject: "head",
      }),
    ];
  }

  return [];
};

export const TS = () => {
  if (isTS) {
    return [
      new ForkTsCheckerWebpackPlugin(
        {
          async: false,
          memoryLimit: 2000,
          tsconfig: typescriptConfigFilePath,
          tslint: tsLintConfigFilePath,
          watch: [`${context}/*.ts`, `${context}/*.tsx`],
          workers: 4,
        },
      ),
    ];
  }

  return [];
};
