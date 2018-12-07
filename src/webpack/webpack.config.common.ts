import * as path from "path";
import { Entry, EntryFunc } from "webpack";
import * as webpack from "webpack";
import { get_bundles_info } from "../components/project_deps/get_bundles_info";
import { envConfig } from "../config/env";
import { rearguardConfig } from "../config/rearguard";
import { get_context, lib_entry_name } from "../helpers";
import { IBundleInfo } from "./../interfaces/IBundleInfo";
import cssLoaders from "./components/css.loders";
import { get_stats } from "./components/get_stats";
import { uglify } from "./components/js.plugins";
// tslint:disable:variable-name object-literal-sort-keys

export function general_WP_config(
  entry: string | string[] | Entry | EntryFunc,
  output: webpack.Output,
  rules: webpack.Rule[],
  plugins: webpack.Plugin[],
  externals: webpack.ExternalsObjectElement,
): webpack.Configuration {
  const { modules } = rearguardConfig;
  const { isDevelopment, isDebug } = envConfig;

  const info: IBundleInfo[] = get_bundles_info();
  const lib_externals: webpack.ExternalsObjectElement = {};

  for (const { has_ui_lib, bundle_name, pkg_name } of info) {
    if (has_ui_lib) {
      lib_externals[pkg_name] = {
        var: lib_entry_name(bundle_name),
      };
    }
  }

  console.log("[ EXTERNALS ]", { ...lib_externals, ...externals });

  return {
    bail: !isDevelopment,
    cache: true,
    context: get_context(),
    devtool: isDebug ? "source-map" : false,
    entry,
    externals: { ...lib_externals, ...externals },
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
      minimizer: uglify(),
    },
    output: {
      // filename - шаблон имен файлов.
      filename: isDevelopment ? "[name].js?[hash:8]" : "[chunkhash:32].js",
      // Дописывает дополнительную информацию в bundle;
      pathinfo: isDebug,
      chunkFilename: isDevelopment ? "[name].chunk.js?[hash:8]" : "[chunkhash:32].chunk.js",
      // globalObject - непонятная хрень, после того, как все отлажу, то обязательно разберусь с этой настройкой.
      globalObject: "this",
      ...output,
    },
    performance: {
      hints: false,
    },
    plugins: [...plugins, new webpack.WatchIgnorePlugin([/node_modules/])],
    profile: true,
    recordsPath: path.resolve(process.cwd(), "node_modules/.cache/webpack/[confighash]/records.json"),
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

// tslint:enable:variable-name object-literal-sort-keys
