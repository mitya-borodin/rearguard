import * as AssetsPlugin from "assets-webpack-plugin";
import * as CleanWebpackPlugin from "clean-webpack-plugin";
import * as fs from "fs";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as UglifyJSPlugin from "uglifyjs-webpack-plugin";
import * as webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import * as WorkboxPlugin from "workbox-webpack-plugin";
import {
  analyze as configAnalyze,
  context,
  dll_assets_name,
  dll_assets_path,
  dll_entry_name,
  dll_lib_name,
  dll_manifest_path,
  dll_path,
  isBuild,
  isDebug,
  isDevelopment,
  isStart,
  output,
  root,
} from "./target.config";

export const HMR = (): webpack.Plugin[] => {
  if (isDevelopment) {
    return [
      new webpack.NamedModulesPlugin(),
      // prints more readable module names in the browser console on HMR updates

      new webpack.HotModuleReplacementPlugin(),
      // enable HMR globally
    ];
  }

  return [];
};

// https://webpack.js.org/plugins/commons-chunk-plugin/
export const extractVendors = (): webpack.Plugin[] => [
  /*  new webpack.optimize.CommonsChunkPlugin(
      {
        minChunks: (module) => module.context && module.context.includes("node_modules"),
        name: "vendor",
      },
    ),*/
];

export const uglify = (): webpack.Plugin[] => {
  if (!isDevelopment) {
    return [
      // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
      new UglifyJSPlugin({
        sourceMap: isDebug,
        uglifyOptions: {
          cache: true,
          compress: {
            sequences: true,
            unused: true,
          },
          ecma: 8,
          parallel: 4,
        },
      }),
    ];
  }

  return [];
};

// Webpack Bundle Analyzer
// https://github.com/th0r/webpack-bundle-analyzer
export const analyze = (): webpack.Plugin[] => {
  if (isDebug) {
    return [
      new BundleAnalyzerPlugin({
        analyzerPort: configAnalyze.port,
      }),
    ];
  }

  return [];
};

export const htmlWebpackPlugin = (dll = true): webpack.Plugin[] => {
  let dllConfig = { [dll_entry_name]: {} };

  if (dll && fs.existsSync(dll_assets_path)) {
    dllConfig = require(dll_assets_path);
  }

  return [
    new HtmlWebpackPlugin({
      dllConfig,
      filename: "index.html",
      inject: false,
      template: path.resolve(
        __dirname,
        "../../../../templates/html-webpack-template.ejs",
      ),
    }),
  ];
};

export const DllPlugin = (): webpack.Plugin[] => {
  return [
    new webpack.DllPlugin({
      context,
      name: dll_entry_name,
      path: dll_manifest_path,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(false),
    new AssetsPlugin({
      filename: dll_assets_name,
      fullPath: false,
      path: dll_path,
      prettyPrint: true,
    }),
  ];
};

export const DllReferencePlugin = (): webpack.Plugin[] => {
  if (fs.existsSync(dll_manifest_path)) {
    return [
      new webpack.DllReferencePlugin({
        context,
        manifest: dll_manifest_path,
        name: dll_lib_name,
      }),
    ];
  }

  return [];
};

export const workboxPlugin = (): webpack.Plugin[] => {
  if ((!isDevelopment || isBuild) && !isStart) {
    console.log(output.path);

    return [
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        globDirectory: output.path,
        globPatterns: ["*.{js,html}"],
        importWorkboxFrom: "local",
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        navigateFallback: "/",
        skipWaiting: true,
        swDest: "sw.js",
      }),
    ];
  }

  return [];
};

export const clean = (
  toRemove: string[] = [],
  force = false,
): webpack.Plugin[] => {
  if (!isDevelopment || force || isBuild) {
    return [new CleanWebpackPlugin(toRemove, { root, verbose: isDebug })];
  }

  return [];
};
