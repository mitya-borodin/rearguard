import * as path from "path";
import * as webpack from "webpack";
import { Entry, EntryFunc } from "webpack";
import cssLoaders from "./components/css.loders";
import { uglify } from "./components/js.plugins";
import { get_sync_npm_modules_info, IInfo } from "./components/sync.npm.deps";
import { context, isDebug, isDevelopment, modules, root, stats } from "./components/target.config";
// tslint:disable:variable-name object-literal-sort-keys

export function general_WP_config(
  entry: string | string[] | Entry | EntryFunc,
  output: webpack.Output & { globalObject: string },
  rules: webpack.Rule[],
  plugins: webpack.Plugin[],
  externals: webpack.ExternalsObjectElement,
): webpack.Configuration {
  const info: IInfo[] = get_sync_npm_modules_info();
  const lib_externals: webpack.ExternalsObjectElement = {};

  for (const { isLibrary, name, bundle_name } of info) {
    if (isLibrary) {
      lib_externals[name] = {
        var: bundle_name,
      };
    }
  }

  return {
    bail: !isDevelopment,
    cache: true,
    context,
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
      ...(isDevelopment
        ? {
            namedModules: true,
            namedChunks: true,
            flagIncludedChunks: false,
            occurrenceOrder: false,
            concatenateModules: false,
            noEmitOnErrors: false,
            checkWasmTypes: false,
            minimize: false,
          }
        : {
            namedModules: false,
            namedChunks: false,
            flagIncludedChunks: true,
            occurrenceOrder: true,
            concatenateModules: true,
            noEmitOnErrors: true,
            checkWasmTypes: true,
            minimize: true,
          }),
      nodeEnv: isDevelopment ? "development" : "production",
      minimizer: uglify(),
    },
    output,
    performance: {
      hints: false,
    },
    plugins: [...plugins],
    profile: true,
    recordsPath: path.resolve(root, "node_modules/.cache/webpack/[confighash]/records.json"),
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".css", ".json"],
      modules,
    },
    resolveLoader: {
      extensions: [".js", ".json"],
      mainFields: ["loader", "main"],
      modules,
    },
    stats,
  };
}

// tslint:enable:variable-name object-literal-sort-keys
