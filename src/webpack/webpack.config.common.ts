import { CleanWebpackPlugin } from "clean-webpack-plugin";
import * as CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";
import { RearguardConfig } from "../configs/RearguardConfig";
import { getCSSLoader } from "./components/getCSSLoader";
import { getExternals } from "./components/getExternals";
import { getTypescriptLoader } from "./components/getTypescriptLoader";
import { getTerserWebpackPlugin } from "./components/plugins/getTerserWebpackPlugin";
import { getWebpackBundleAnalyzerPlugin } from "./components/plugins/getWebpackBundleAnalyzerPlugin";
import { HashWebpackPlugin } from "./components/plugins/HashWebpackPlugin";
import { getRearguardNodeModulesPath, getLocalNodeModulePath } from "../helpers/dependencyPaths";
// tslint:disable:variable-name object-literal-sort-keys

export const getGeneralWebpackConfig = async (
  CWD: string,
  isDevelopment: boolean,
  entry: string[] | webpack.Entry,
  output: webpack.Output,
  plugins: webpack.Plugin[],
  isDebug = false,
  needUpdateBuildTime = false,
  rules: webpack.Rule[] = [],
  externals: webpack.ExternalsObjectElement = {},
): Promise<webpack.Configuration> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const modules = [
    ...rearguardConfig.getModules(),
    getLocalNodeModulePath(CWD),
    // ! getRearguardNodeModulesPath must be in the end of list.
    getRearguardNodeModulesPath(CWD),
  ];

  return {
    context: contextPath,
    entry,
    externals: { ...(await getExternals(CWD, isDevelopment)), ...externals },
    mode: "none",
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },
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
        ...getTypescriptLoader(CWD),
        ...getCSSLoader(CWD, isDevelopment, isDebug),
        ...rules,
      ],
    },
    output: {
      filename: isDevelopment ? "[name].js?[hash:8]" : "[hash:32].js",
      pathinfo: isDebug,
      chunkFilename: isDevelopment ? "[name].chunk.js?[hash:8]" : "[hash:32].chunk.js",
      globalObject: "this",
      ...output,
    },

    resolve: {
      extensions: [".js", ".ts", ".tsx", ".css", ".json"],
      modules,
    },
    resolveLoader: {
      extensions: [".js", ".json"],
      mainFields: ["loader", "main"],
      modules,
    },
    plugins: [
      new webpack.WatchIgnorePlugin([/node_modules/]),
      new webpack.ProgressPlugin(),
      new CaseSensitivePathsPlugin(),
      new CleanWebpackPlugin(),
      ...plugins,
      new HashWebpackPlugin(CWD, isDevelopment, needUpdateBuildTime),
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how Webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      ...(await getWebpackBundleAnalyzerPlugin(CWD, isDebug)),
    ],
    bail: !isDevelopment,
    cache: true,
    devtool: isDebug ? "source-map" : false,
    optimization: {
      concatenateModules: false,
      flagIncludedChunks: false,
      occurrenceOrder: false,
      namedModules: isDevelopment,
      namedChunks: isDevelopment,
      nodeEnv: isDevelopment ? "development" : "production",
      minimize: !isDevelopment,
      noEmitOnErrors: !isDevelopment,
      minimizer: getTerserWebpackPlugin(isDevelopment),
    },
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      module: "empty",
      dgram: "empty",
      dns: "mock",
      fs: "empty",
      http2: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
    },
    profile: true,
    recordsPath: path.resolve(CWD, "node_modules/.cache/webpack/[confighash]/records.json"),
  };
};

// tslint:enable:variable-name object-literal-sort-keys
