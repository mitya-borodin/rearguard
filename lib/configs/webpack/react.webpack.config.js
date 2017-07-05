'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackNodeExternals = require('webpack-node-externals');

var _webpackNodeExternals2 = _interopRequireDefault(_webpackNodeExternals);

var _prepareBuildTools = require('../prepare.build-tools.config');

var _generalWebpack = require('./general.webpack.config');

var _generalWebpack2 = _interopRequireDefault(_generalWebpack);

var _entry = require('./general/entry');

var _css = require('./plugins/css');

var _js = require('./plugins/js');

var _babel = require('./rules/babel');

var _babel2 = _interopRequireDefault(_babel);

var _css2 = require('./rules/css');

var _files = require('./rules/files');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reactBabelPresets = [
// JSX, Flow
// https://github.com/babel/babel/tree/master/packages/babel-preset-react
'react',

// Optimize React code for the production build
// https://github.com/thejameskyle/babel-react-optimize
// https://github.com/thejameskyle/babel-react-optimize#transform-react-inline-elements
// Note: You should use this with babel-runtime and babel-transform-runtime to avoid duplicating the helper code in every file.
...(_prepareBuildTools.isProduction ? ['react-optimize'] : [])];

const reactBabelPlugin = [
// https://www.npmjs.com/package/babel-plugin-transform-runtime
// Note: You should use this with babel-runtime and babel-transform-runtime to avoid duplicating the helper code in every file.
...(_prepareBuildTools.isProduction ? ['transform-runtime'] : []),

// http://gaearon.github.io/react-hot-loader/getstarted/
...(_prepareBuildTools.isDevelopment && _prepareBuildTools.isRHL ? ['react-hot-loader/babel'] : []),

// Adds component stack to warning messages
// https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source
...(_prepareBuildTools.isDevelopment ? ['transform-react-jsx-source'] : []),

// Adds __self attribute to JSX which React will use for some warnings
// https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-self
...(_prepareBuildTools.isDevelopment ? ['transform-react-jsx-self'] : [])];

const RHL_patch = _prepareBuildTools.isRHL ? ['react-hot-loader/patch'] : [];

const spa = (0, _generalWebpack2.default)({
  entry: _prepareBuildTools.isIsomorphic ? (0, _entry.isomorphicEntry)([...RHL_patch]) : (0, _entry.spaEntry)([...RHL_patch]),
  rules: [(0, _babel2.default)(/\.(jsx|js)?$/, reactBabelPresets, reactBabelPlugin, _prepareBuildTools.babelEnvSpa, [/node_modules/, /mobx.js/]), (0, _css2.internalCSS)(), (0, _css2.externalCSS)(), (0, _files.file)()],
  plugins: [(0, _js.extractVendors)(), ...(0, _css.extractCSS)(), ...(0, _js.HMR)(), ...(0, _js.uglify)(), ...(0, _js.getAssetsFile)(), ...(0, _js.getIndexHtmlFile)()]
});

const server = (0, _generalWebpack2.default)({
  entry: (0, _entry.serverEntry)(),
  target: 'node',
  output: {
    filename: _prepareBuildTools.filenameServer,
    libraryTarget: 'commonjs2'
  },
  rules: [
  // Override babel-preset-env configuration for Node.js
  (0, _babel2.default)(/\.(js|jsx)?$/, reactBabelPresets, reactBabelPlugin, _prepareBuildTools.babelEnvServer), (0, _css2.internalCSS)(), (0, _css2.externalCSS)(), (0, _files.file)()],
  plugins: [

  // Do not create separate chunks of the server bundle
  // https://webpack.github.io/docs/list-of-plugins.html#limitchunkcountplugin
  new _webpack2.default.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),

  // Adds a banner to the top of each generated chunk
  // https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
  new _webpack2.default.BannerPlugin({
    banner: 'require("source-map-support").install();',
    raw: true,
    entryOnly: false
  })],
  externals: [/^\.\/assets\.json$/, /^\.\/config\.json$/, (0, _webpackNodeExternals2.default)({
    whitelist: /\.css/
  })],
  devtool: _prepareBuildTools.isDevelopment ? 'cheap-module-source-map' : 'source-map',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  }
});

exports.default = _prepareBuildTools.isIsomorphic ? [spa, server] : spa;
//# sourceMappingURL=react.webpack.config.js.map