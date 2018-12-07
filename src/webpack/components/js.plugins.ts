import * as AssetsPlugin from "assets-webpack-plugin";
import chalk from "chalk";
import * as CleanWebpackPlugin from "clean-webpack-plugin";
import * as fs from "fs";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { snakeCase } from "lodash";
import * as path from "path";
import * as TerserPlugin from "terser-webpack-plugin";
import * as webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import * as WorkboxPlugin from "workbox-webpack-plugin";
import { get_bundles_info } from "../../components/project_deps/get_bundles_info";
import { envConfig } from "../../config/env";
import { pkgInfo } from "../../config/pkg";
import { ASSETS_NAME, BUNDLE_SUB_DIR } from "../../const";
import {
  dll_assets_path,
  dll_entry_name,
  dll_manifest_path,
  dll_output_path,
  get_context,
  get_output_path,
  lib_entry_name,
} from "../../helpers";
import { IBundleInfo } from "../../interfaces/IBundleInfo";
import { analyzeConfig } from "./../../config/analyze/index";

// tslint:disable:variable-name

export const DllPlugin = (): webpack.Plugin[] => {
  return [
    ...clean([dll_output_path()], true),
    new webpack.DllPlugin({
      context: get_context(),
      name: dll_entry_name(),
      path: dll_manifest_path(),
    }),
    new webpack.optimize.OccurrenceOrderPlugin(false),
  ];
};

export const DllReferencePlugin = (exclude_them_self = false): webpack.Plugin[] => {
  const bundlesInfo: IBundleInfo[] = get_bundles_info();
  const plugins: webpack.Plugin[] = [];

  for (const { has_dll, bundle_entry_name, manifest } of bundlesInfo) {
    if (has_dll) {
      if (path.isAbsolute(manifest) && fs.existsSync(manifest)) {
        plugins.push(
          new webpack.DllReferencePlugin({
            context: get_context(),
            manifest,
            name: bundle_entry_name.dll,
          }),
        );
      } else {
        console.log(chalk.red(`[ DllReferencePlugin ][ ERROR ][ MANIFEST_NOT_FOUND: ${manifest} ]`));

        process.exit(1);
      }
    }
  }

  if (!exclude_them_self) {
    if (fs.existsSync(dll_manifest_path())) {
      plugins.push(
        new webpack.DllReferencePlugin({
          context: get_context(),
          manifest: dll_manifest_path(),
          name: dll_entry_name(),
        }),
      );
    }
  }

  return plugins;
};

class ComputeDataForHWP {
  public apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap("compute_data_for_html_webpack_plugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
        "compute_data_for_html_webpack_plugin", // <-- Set a meaningful name here for stacktraces
        (
          compilation_data: {
            assets: {
              publicPath: string;
              js: string[];
              css: string[];
              favicon?: string | undefined;
              manifest?: string | undefined;
            };
            outputName: string;
            plugin: HtmlWebpackPlugin;
          },
          callback: (...args: any[]) => void,
        ) => {
          const bundlesInfo: IBundleInfo[] = get_bundles_info();
          const data: { js: string[] } = { js: [] };

          for (const { assets, bundle_name, has_dll, has_ui_lib } of bundlesInfo) {
            if (has_dll && fs.existsSync(assets.dll)) {
              data.js.push(require(assets.dll)[dll_entry_name(bundle_name)].js);
            }

            if (has_ui_lib && fs.existsSync(assets.lib)) {
              data.js.push(require(assets.lib)[lib_entry_name(bundle_name)].js);
            }
          }

          if (fs.existsSync(dll_assets_path())) {
            data.js.push(require(dll_assets_path())[dll_entry_name()].js);
          }

          // Manipulate the content

          compilation_data.assets.js = [...data.js, ...compilation_data.assets.js];

          console.log(compilation_data.assets);

          // Tell webpack to move on
          callback(null, compilation_data);
        },
      );
    });
  }
}

export const htmlWebpackPlugin = (): webpack.Plugin[] => {
  const { isWDS, isBuild } = envConfig;

  if (isWDS || isBuild) {
    return [
      new HtmlWebpackPlugin({
        filename: "index.html",
        inject: false,
        template: path.resolve(__dirname, "../../../../templates/html-webpack-template.ejs"),
        // tslint:disable-next-line:object-literal-sort-keys
        meta: { viewport: "width=device-width, initial-scale=1, shrink-to-fit=no" },
      }),
      new ComputeDataForHWP(),
    ];
  }

  return [];
};

export const HMR = (): webpack.Plugin[] => {
  const { isDevelopment, isBuild } = envConfig;

  if (isDevelopment && !isBuild) {
    return [
      // prints more readable module names in the browser console on HMR updates
      new webpack.NamedModulesPlugin(),

      // enable HMR globally
      new webpack.HotModuleReplacementPlugin(),
    ];
  }

  return [];
};

export const uglify = (): webpack.Plugin[] => {
  const { isDevelopment } = envConfig;

  if (!isDevelopment) {
    return [
      // https://github.com/webpack-contrib/terser-webpack-plugin
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          compress: {
            sequences: true,
            unused: true,
          },
          ecma: 8,
        },
      }),
    ];
  }

  return [];
};

export const workboxPlugin = (): webpack.Plugin[] => {
  const { isDevelopment } = envConfig;

  if (!isDevelopment) {
    return [
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        globDirectory: get_output_path(),
        globPatterns: ["*.{js,html,jpeg,jpg,svg,gif,png,ttf}"],
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

// Webpack Bundle Analyzer
// https://github.com/th0r/webpack-bundle-analyzer
export const analyze = (): webpack.Plugin[] => {
  const { isDebug } = envConfig;
  const { port } = analyzeConfig;

  if (isDebug) {
    return [
      new BundleAnalyzerPlugin({
        analyzerPort: port,
      }),
    ];
  }

  return [];
};

export const clean = (toRemove: string[] = [], force = false): webpack.Plugin[] => {
  const { isDevelopment, isBuild, isDebug } = envConfig;

  if (!isDevelopment || force || isBuild) {
    return [new CleanWebpackPlugin(toRemove, { root: process.cwd(), verbose: isDebug })];
  }

  return [];
};

// tslint:disable:variable-name
export const assetsPlugin = (bundle_dir: string) => {
  return [
    new AssetsPlugin({
      path: path.resolve(envConfig.rootDir, bundle_dir, snakeCase(pkgInfo.name), BUNDLE_SUB_DIR()),
      // tslint:disable-next-line:object-literal-sort-keys
      filename: ASSETS_NAME,
      processOutput(data: any) {
        const result: { [key: string]: any } = {};

        for (const key in data) {
          if (key.indexOf(snakeCase(pkgInfo.name)) !== -1) {
            result[key] = data[key];
          }
        }

        return JSON.stringify(result, null, 2);
      },
    }),
  ];
};

// tslint:enable:variable-name
