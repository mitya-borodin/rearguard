import * as webpack from "webpack";
import * as nodeExternals from "webpack-node-externals";
import generalWebpackConfig from "./general.webpack.config";
import {backEntry, frontEntry} from "./general/entry";
import {extractCSS} from "./plugins/css";
import {analyze, assetsPlugin, extractVendors, HMR, htmlWebpackPlugin, uglify} from "./plugins/js";
import compiler from "./rules/compiler";
import {analyzeClientPort, analyzeServerPort, isBuild, isDevelopment, isIsomorphic, isStart, onlyServer, resolveNodeModules, serverFilename} from "./target.config";

const spa = generalWebpackConfig({
  entry: frontEntry(),
  plugins: [
    extractVendors(),
    ...extractCSS(),
    ...HMR(),
    ...assetsPlugin(),
    ...htmlWebpackPlugin(),
    ...uglify(),
    ...analyze(analyzeClientPort),
  ],
  rules: compiler(false),
});

const server = generalWebpackConfig({
  devtool: isDevelopment ? "cheap-module-source-map" : false,
  entry: backEntry(),
  externals: [
    /^\.\/assets\.json$/,
    /^\.\/config\.json$/,
    /^\.\/config\.js$/,
    nodeExternals({whitelist: /\.css/}),
  ],
  node: {
    Buffer: false,
    __dirname: false,
    __filename: false,
    console: false,
    global: false,
    process: false,
  },
  output: {
    filename: serverFilename,
    libraryTarget: "commonjs2",
  },
  plugins: [
    // Do not create separate chunks of the server bundle
    // https://webpack.github.io/docs/list-of-plugins.html#limitchunkcountplugin
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),

    // Adds a banner to the top of each generated chunk
    // https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
    new webpack.BannerPlugin({
      banner: `require("${(isDevelopment || isStart) && !isBuild ? resolveNodeModules("source-map-support") : "source-map-support"}").install();`,
      entryOnly: false,
      raw: true,
    }),
    ...analyze(analyzeServerPort),
  ],
  rules: compiler(true),
  target: "node",
});

let config: any = [];

if (onlyServer) {
  config = server;
} else if (isIsomorphic) {
  config = [spa, server];
} else {
  config = spa;
}

export default config;
