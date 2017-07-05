'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexHtmlFile = exports.getAssetsFile = exports.defineEnv = exports.analyze = exports.uglify = exports.extractVendors = exports.HMR = undefined;

var _assetsWebpackPlugin = require('assets-webpack-plugin');

var _assetsWebpackPlugin2 = _interopRequireDefault(_assetsWebpackPlugin);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

var _uglifyjsWebpackPlugin2 = _interopRequireDefault(_uglifyjsWebpackPlugin);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackBundleAnalyzer = require('webpack-bundle-analyzer');

var _prepareBuildTools = require('../../prepare.build-tools.config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HMR = exports.HMR = () => {
  if (_prepareBuildTools.isDevelopment) {
    return [new _webpack2.default.HotModuleReplacementPlugin(),
    // enable HMR globally

    new _webpack2.default.NamedModulesPlugin()];
  }

  return [];
};

// https://webpack.js.org/plugins/commons-chunk-plugin/
const extractVendors = exports.extractVendors = () => new _webpack2.default.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: module => /node_modules/.test(module.resource)
});

const uglify = exports.uglify = () => {
  if (_prepareBuildTools.isProduction) {
    return [
    // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
    new _uglifyjsWebpackPlugin2.default({
      sourceMap: true,
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: _prepareBuildTools.isVerbose,
        unused: true,
        dead_code: true
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    })];
  }

  return [];
};

// Webpack Bundle Analyzer
// https://github.com/th0r/webpack-bundle-analyzer
const analyze = exports.analyze = () => {
  if (_prepareBuildTools.isAnalyze) {
    return [new _webpackBundleAnalyzer.BundleAnalyzerPlugin()];
  }

  return [];
};

// https://webpack.js.org/plugins/define-plugin/
const defineEnv = exports.defineEnv = () => new _webpack2.default.DefinePlugin({
  'process.env.NODE_ENV': _prepareBuildTools.env.NODE_ENV,
  'process.env.DEBUG': _prepareBuildTools.env.DEBUG,
  __DEV__: _prepareBuildTools.env.__DEV__,
  __PROD__: _prepareBuildTools.env.__PROD__,
  __RHL__: _prepareBuildTools.env.__RHL__
});

// Emit a file with assets paths
// https://github.com/sporto/assets-webpack-plugin#options
const getAssetsFile = exports.getAssetsFile = () => {
  if (_prepareBuildTools.isIsomorphic) {
    return [new _assetsWebpackPlugin2.default({
      path: _prepareBuildTools.outputServer,
      filename: 'assets.json',
      prettyPrint: true
    })];
  }

  return [];
};
const getIndexHtmlFile = exports.getIndexHtmlFile = () => {
  if (!_prepareBuildTools.isIsomorphic) {
    return [new _htmlWebpackPlugin2.default({
      filename: 'index.html',
      inject: 'head'
    })];
  }

  return [];
};
//# sourceMappingURL=js.js.map