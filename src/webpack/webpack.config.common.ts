import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import path from "path";
import webpack from "webpack";
import { RearguardConfig } from "../configs/RearguardConfig";
import { getLocalNodeModulePath, getRearguardNodeModulesPath } from "../helpers/dependencyPaths";
import { getChunkOptimization } from "./components/getChunkOptimization";
import { getCSSLoader } from "./components/getCSSLoader";
import { getExternals } from "./components/getExternals";
import { getTypescriptLoader } from "./components/getTypescriptLoader";
import { getManifestPlugin } from "./components/plugins/getManifestPlugin";
import { getMiniCssExtractPlugin } from "./components/plugins/getMiniCssExtractPlugin";
import { getOptimizeCSSAssetsPlugin } from "./components/plugins/getOptimizeCSSAssetsPlugin";
import { getTerserWebpackPlugin } from "./components/plugins/getTerserWebpackPlugin";
import { getWebpackBundleAnalyzerPlugin } from "./components/plugins/getWebpackBundleAnalyzerPlugin";
import { HashWebpackPlugin } from "./components/plugins/HashWebpackPlugin";

export const getGeneralWebpackConfig = async (
  CWD: string,
  isDevelopment: boolean,
  entry: string[] | webpack.Entry,
  output: webpack.Output,
  plugins: webpack.Plugin[],
  isDebug = false,
  needUpdateBuildTime = false,
  isProfile = false,
  rules: webpack.Rule[] = [],
  externals: webpack.ExternalsObjectElement = {},
  isDll = false,
): Promise<webpack.Configuration> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const modules = [
    // ! First of all, modules from the current project are connected
    ...rearguardConfig.getModules(),
    // ! The second step is to connect the modules from the node_modules of the specific project.
    getLocalNodeModulePath(CWD),
    // ! The modules from rearguard node_modules are connected last.
    getRearguardNodeModulesPath(CWD),
  ];
  const [eslintLoader, tsLoader] = getTypescriptLoader(CWD);
  const fileRegExp = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|bmp|gif)(\?.*)?$/;
  const rawFileRegExp = /\.(text|csv)(\?.*)?$/;

  return {
    mode: isDevelopment ? "development" : "production",
    bail: !isDevelopment,
    devtool: isDebug ? "source-map" : false,
    context: contextPath,
    entry,
    externals: { ...(await getExternals(CWD, isDevelopment)), ...externals },
    output: {
      pathinfo: isDevelopment,

      filename: "[name].[hash:8].js",
      chunkFilename: "[name].[hash:8].chunk.js",

      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: "this",

      // Prevents conflicts when multiple Webpack runtimes (from different apps)
      // are used on the same page.
      jsonpFunction: `webpackJsonp_rearguard_${rearguardConfig.getSnakeName()}`,

      // TODO: remove this when upgrading to webpack 5
      futureEmitAssets: true,
      ...output,
    },
    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        ...getTerserWebpackPlugin(isDevelopment),
        ...getOptimizeCSSAssetsPlugin(isDevelopment, isDebug),
      ],
      ...(isDll ? [] : getChunkOptimization(CWD)),
    },
    resolve: {
      modules,
      extensions: [".ts", ".tsx", ".css", ".scss", ".sass", ".js", ".jsx", ".json"],
      alias: {
        ...(isProfile
          ? {
              "react-dom$": "react-dom/profiling",
              "scheduler/tracing": "scheduler/tracing-profiling",
            }
          : {}),
      },
    },
    resolveLoader: {
      modules,
      extensions: [".js", ".json"],
      mainFields: ["loader", "main"],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },
        // First, run the linter.
        eslintLoader,
        {
          oneOf: [
            // A loader for webpack which transforms files into base64 URIs.
            // url-loader works like file-loader, but can return a DataURL if the file is smaller than a byte limit.
            // https://webpack.js.org/loaders/url-loader/
            {
              test: fileRegExp,
              loader: "url-loader",
              options: {
                limit: 10240,
                name: "[name].[hash:8].[ext]",
              },
            },
            tsLoader,
            ...getCSSLoader(CWD, isDevelopment, isDebug),
            ...rules,
            // https://webpack.js.org/loaders/raw-loader/
            // A loader for webpack that allows importing files as a String.
            {
              test: rawFileRegExp,
              use: "raw-loader",
            },
            {
              loader: "file-loader",
              test: fileRegExp,
              query: {
                name: isDevelopment ? "[path][name].[ext]?[hash:8]" : "[hash:32].[ext]",
              },
            },
          ],
        },
      ],
    },
    plugins: [
      // ! CleanWebpackPlugin should be before other plugins
      new CleanWebpackPlugin({ verbose: true }),

      new CaseSensitivePathsPlugin(),
      new webpack.ProgressPlugin(),
      new webpack.WatchIgnorePlugin([/node_modules/]),

      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how Webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      ...getMiniCssExtractPlugin(CWD, isDevelopment),
      ...getManifestPlugin(CWD, output),

      ...plugins,

      new HashWebpackPlugin(CWD, isDevelopment, needUpdateBuildTime),
      ...(await getWebpackBundleAnalyzerPlugin(CWD, isDebug)),
    ],
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
  };
};

// tslint:enable:variable-name object-literal-sort-keys
