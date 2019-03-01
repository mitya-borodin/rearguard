import * as AssetsPlugin from "assets-webpack-plugin";
import chalk from "chalk";
import * as CleanWebpackPlugin from "clean-webpack-plugin";
import * as fs from "fs";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { snakeCase } from "lodash";
import * as moment from "moment";
import * as path from "path";
import * as TerserPlugin from "terser-webpack-plugin";
import * as webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import * as WorkboxPlugin from "workbox-webpack-plugin";
import { get_bundles_info } from "../../components/project_deps/get_bundles_info";
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
import { IBuildStatusConfig } from "../../interfaces/config/IBuildStatusConfig";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import { IRearguardConfig } from "../../interfaces/config/IRearguardConfig";
import { IBundleInfo } from "../../interfaces/IBundleInfo";
import { analyzeConfig } from "./../../config/analyze/index";

// tslint:disable:variable-name

export const DllPlugin = (envConfig: IEnvConfig): webpack.Plugin[] => {
  return [
    ...clean(envConfig, [dll_output_path()], true),
    new webpack.DllPlugin({
      context: get_context(),
      name: dll_entry_name(),
      path: dll_manifest_path(),
    }),
  ];
};

export const DllReferencePlugin = (
  envConfig: IEnvConfig,
  rearguardConfig: IRearguardConfig,
  exclude_them_self = false,
): webpack.Plugin[] => {
  const bundlesInfo: IBundleInfo[] = get_bundles_info(envConfig, rearguardConfig);
  const plugins: webpack.Plugin[] = [];

  for (const { has_dll, bundle_entry_name, manifest, load_on_demand } of bundlesInfo) {
    if (!load_on_demand && has_dll) {
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

  // exclude_them_self - выставляется в true в случае когда dll зависит от dll.

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
  private rearguardConfig: IRearguardConfig;
  private envConfig: IEnvConfig;

  constructor(envConfig: IEnvConfig, rearguardConfig: IRearguardConfig) {
    this.rearguardConfig = rearguardConfig;
    this.envConfig = envConfig;

    this.apply = this.apply.bind(this);
  }

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
          const bundlesInfo: IBundleInfo[] = get_bundles_info(this.envConfig, this.rearguardConfig);
          const data: { js: string[]; css: [] } = { js: [], css: [] };

          for (const { assets, bundle_name, has_dll, has_browser_lib, load_on_demand } of bundlesInfo) {
            if (!load_on_demand) {
              if (has_dll && fs.existsSync(assets.dll)) {
                data.js.push(require(assets.dll)[dll_entry_name(bundle_name)].js);
              }

              if (has_browser_lib && fs.existsSync(assets.lib)) {
                data.js.push(require(assets.lib)[lib_entry_name(bundle_name)].js);
              }
            }
          }

          if (!this.rearguardConfig.load_on_demand && fs.existsSync(dll_assets_path())) {
            data.js.push(require(dll_assets_path())[dll_entry_name()].js);
          }

          // Manipulate the content
          compilation_data.assets.js = [...data.js, ...compilation_data.assets.js];

          console.log("");
          console.log(chalk.bold.green("[ HtmlWebpackPlugin ][ BUILD ][ index.html ]"));
          for (const css of compilation_data.assets.css) {
            console.log(chalk.green(`[ CSS ][ ${css} ]`));
          }
          for (const js of compilation_data.assets.js) {
            console.log(chalk.green(`[ JS ][ ${js} ]`));
          }
          console.log("");

          // Tell webpack to move on
          callback(null, compilation_data);
        },
      );
    });
  }
}

export const htmlWebpackPlugin = (envConfig: IEnvConfig, rearguardConfig: IRearguardConfig): webpack.Plugin[] => {
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
      new ComputeDataForHWP(envConfig, rearguardConfig),
    ];
  }

  return [];
};

export const HMR = (envConfig: IEnvConfig): webpack.Plugin[] => {
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

export const uglify = (envConfig: IEnvConfig): webpack.Plugin[] => {
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

export const workboxPlugin = (envConfig: IEnvConfig): webpack.Plugin[] => {
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
export const analyze = (envConfig: IEnvConfig): webpack.Plugin[] => {
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

export const clean = (envConfig: IEnvConfig, toRemove: string[] = [], force = false): webpack.Plugin[] => {
  const { isDevelopment, isBuild, isDebug } = envConfig;

  if (!isDevelopment || force || isBuild) {
    return [new CleanWebpackPlugin(toRemove, { root: process.cwd(), verbose: isDebug })];
  }

  return [];
};

// tslint:disable:variable-name
export const assetsPlugin = (envConfig: IEnvConfig, bundle_dir: string) => {
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

// tslint:disable-next-line: max-classes-per-file
export class HashWebpackPlugin {
  private buildStatusConfig: IBuildStatusConfig;
  private envConfig: IEnvConfig;

  constructor(buildStatusConfig: IBuildStatusConfig, envConfig: IEnvConfig) {
    this.buildStatusConfig = buildStatusConfig;
    this.envConfig = envConfig;

    this.apply = this.apply.bind(this);
  }

  public apply(compiler: webpack.Compiler) {
    // ! See https://webpack.js.org/api/plugins/compiler/#event-hooks
    compiler.plugin("after-emit", (compilation, callback) => {
      const hash = compilation.hash;
      let hash_key: "hash_dev" | "hash_prod" = "hash_dev";

      if (this.envConfig.isDevelopment) {
        hash_key = "hash_dev";
      } else {
        hash_key = "hash_prod";
      }

      console.log("isDevelopment", this.envConfig.isDevelopment);
      console.log("hash_key", hash_key);

      const cur_hash = this.buildStatusConfig[hash_key];

      console.log("cur_hash !== hash", cur_hash !== hash);

      if (cur_hash !== hash) {
        this.buildStatusConfig.last_build_time = moment();
      }

      this.buildStatusConfig[hash_key] = hash;

      callback(null);
    });
  }
}

// tslint:enable:variable-name
