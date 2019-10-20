import chalk from "chalk";
import * as path from "path";
import { Entry, EntryFunc } from "webpack";
import * as webpack from "webpack";
import { get_bundles_info } from "../components/project_deps/get_bundles_info";
import { get_context, lib_entry_name } from "../helpers";
import { IEnvConfig } from "../interfaces/config/IEnvConfig";
import { IRearguardConfig } from "../interfaces/config/IRearguardConfig";
import { IBundleInfo } from "./../interfaces/IBundleInfo";
import cssLoaders from "./components/css.loders";
import { uglify } from "./components/js.plugins";

export function general_WP_config(
  envConfig: IEnvConfig,
  rearguardConfig: IRearguardConfig,
  entry: string | string[] | Entry | EntryFunc,
  output: webpack.Output,
  rules: webpack.Rule[],
  plugins: webpack.Plugin[],
  a_externals: webpack.ExternalsObjectElement,
): webpack.Configuration {
  const { modules } = rearguardConfig;
  const { isDevelopment, isDebug } = envConfig;

  const info: IBundleInfo[] = get_bundles_info(envConfig, rearguardConfig);
  const lib_externals: webpack.ExternalsObjectElement = {};

  for (const { has_browser_lib, bundle_name, pkg_name } of info) {
    if (has_browser_lib) {
      lib_externals[pkg_name] = {
        var: lib_entry_name(bundle_name),
      };
    }
  }

  const externals: { [key: string]: any } = { ...lib_externals, ...a_externals };

  if (Object.keys(externals).length > 0) {
    console.log(chalk.bold.green("[ EXTERNALS ]"));
    for (const key in externals) {
      if (externals.hasOwnProperty(key)) {
        const types = Object.keys(externals[key]);

        for (const type of types) {
          console.log(chalk.green(`[ ${key} ][ ${type} ][ ${externals[key][type]} ]`));
        }
      }
    }
  }

  return {
    bail: !isDevelopment,
    cache: true,
    context: get_context(),
    devtool: isDebug ? "source-map" : false,
    entry,
    externals,
    mode: "none",
    module: {
      rules: [
        {
          loader: "file-loader",
          query: {
            name: isDevelopment ? "[path][name].[ext]?[hash:8]" : "[hash:32].[ext]",
          },
          test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        },
        {
          test: /\.(text|csv)(\?.*)?$/,
          use: "raw-loader",
        },
        ...cssLoaders(),
        ...rules,
      ],
    },
    optimization: {
      concatenateModules: false,
      flagIncludedChunks: false,
      occurrenceOrder: false,
      namedModules: isDevelopment,
      namedChunks: isDevelopment,
      nodeEnv: isDevelopment ? "development" : "production",
      minimize: !isDevelopment,
      noEmitOnErrors: !isDevelopment,
      minimizer: uglify(envConfig),
    },
    output: {
      // filename - шаблон имен файлов.
      filename: isDevelopment ? "[name].js?[hash:8]" : "[hash:32].js",
      // Дописывает дополнительную информацию в bundle;
      pathinfo: isDebug,
      chunkFilename: isDevelopment ? "[name].chunk.js?[hash:8]" : "[hash:32].chunk.js",
      // globalObject - непонятная хрень, после того, как все отлажу, то обязательно разберусь с этой настройкой.
      globalObject: "this",
      ...output,
    },
    performance: {
      hints: false,
    },
    plugins: [
      new webpack.WatchIgnorePlugin([/node_modules/]),
      new webpack.ProgressPlugin(),
      ...plugins,
    ],
    profile: true,
    recordsPath: path.resolve(
      process.cwd(),
      "node_modules/.cache/webpack/[confighash]/records.json",
    ),
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".css", ".json"],
      modules,
    },
    resolveLoader: {
      extensions: [".js", ".json"],
      mainFields: ["loader", "main"],
      modules,
    },
  };
}
