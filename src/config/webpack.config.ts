import * as webpack from 'webpack';
import * as nodeExternals from 'webpack-node-externals';
import { serverFilename, isDevelopment, isIsomorphic, onlyServer, resolveNodeModules } from './target.config';
import generalWebpackConfig from './general.webpack.config';
import { frontEntry, backEntry } from './general/entry';
import { extractCSS } from './plugins/css';
import { extractVendors, assetsPlugin, htmlWebpackPlugin, HMR, uglify } from './plugins/js';
import compiler from './rules/compiler';

const spa = generalWebpackConfig({
  entry: frontEntry(),
  rules: [
    ...compiler(),
  ],
  plugins: [
    extractVendors(),
    ...extractCSS(),
    ...HMR(),
    ...assetsPlugin(),
    ...htmlWebpackPlugin(),
    ...uglify(),
  ],
});

const server = generalWebpackConfig({
  entry: backEntry(),
  target: 'node',
  output: {
    filename: serverFilename,
    libraryTarget: 'commonjs2',
  },
  rules: [
    // Override babel-preset-env configuration for Node.js
    ...compiler({}, true),
  ],
  plugins: [
    // Do not create separate chunks of the server bundle
    // https://webpack.github.io/docs/list-of-plugins.html#limitchunkcountplugin
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    
    // Adds a banner to the top of each generated chunk
    // https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
    new webpack.BannerPlugin({
      banner: `require("${resolveNodeModules('source-map-support')}").install();`,
      raw: true,
      entryOnly: false,
    }),
  ],
  externals: [
    /^\.\/assets\.json$/,
    /^\.\/config\.json$/,
    nodeExternals({
      whitelist: /\.css/,
    }),
  ],
  devtool: isDevelopment ? 'cheap-module-source-map' : 'source-map',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
});

let config: any = [];

if (isIsomorphic && !onlyServer) {
  config = [spa, server];
} else if (isIsomorphic && onlyServer) {
  config = server;
} else {
  config = spa;
}

export default config;
