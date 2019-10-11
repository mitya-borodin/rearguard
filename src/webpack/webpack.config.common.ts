import { CleanWebpackPlugin } from "clean-webpack-plugin";
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
    await getRearguardNodeModulesPath(CWD),
    getLocalNodeModulePath(CWD),
  ];

  return {
    context: contextPath,
    entry,
    externals: { ...(await getExternals(CWD, isDevelopment)), ...externals },
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
      new CleanWebpackPlugin(),
      ...plugins,
      new HashWebpackPlugin(CWD, isDevelopment, needUpdateBuildTime),
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
    performance: {
      hints: false,
    },
    profile: true,
    recordsPath: path.resolve(CWD, "node_modules/.cache/webpack/[confighash]/records.json"),
  };
};

// tslint:enable:variable-name object-literal-sort-keys
