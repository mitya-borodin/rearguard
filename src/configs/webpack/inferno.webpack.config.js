import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { babelEnvServer, babelEnvSpa, filenameServer, isIsomorphic } from '../prepare.build-tools.config';
import generalWebpackConfig from './general.webpack.config';
import { clientEntry, serverEntry } from './general/entry';
import { extractCSS } from './plugins/css';
import { extractVendors, getAssetsFile, getIndexHtmlFile, HMR, uglify } from './plugins/js';
import compiler from './rules/compiler';
import { externalCSS, internalCSS } from './rules/css';
import { file } from './rules/files';

const spa = generalWebpackConfig({
  entry: clientEntry(),
  rules: [
    ...compiler({
      babel: {
        presets: [],
        plugins: [['inferno', { 'imports': true }]],
        envPreset: babelEnvSpa,
      },
      exclude: [/node_modules/, /mobx.js/],
    }),
    internalCSS(),
    externalCSS(),
    file(),
  ],
  plugins: [
    extractVendors(),
    ...extractCSS(),
    ...HMR(),
    ...uglify(),
    ...getAssetsFile(),
    ...getIndexHtmlFile()
  ],
});

const server = generalWebpackConfig({
  entry: serverEntry(),
  target: 'node',
  output: {
    filename: filenameServer,
    libraryTarget: 'commonjs2',
  },
  rules: [
    // Override babel-preset-env configuration for Node.js
    ...compiler({
      babel: {
        presets: [],
        plugins: ['inferno'],
        envPreset: babelEnvServer,
      },
      exclude: [/node_modules/, /mobx.js/],
    }),
    internalCSS(),
    externalCSS(),
    file(),
  ],
  plugins: [
    // Do not create separate chunks of the server bundle
    // https://webpack.github.io/docs/list-of-plugins.html#limitchunkcountplugin
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),

    // Adds a banner to the top of each generated chunk
    // https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
  ],
  externals: [
    /^\.\/assets\.json$/,
    /^\.\/config\.json$/,
    nodeExternals(),
  ],
  devtool: 'source-map',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
});

export default isIsomorphic ? [spa, server] : spa;
