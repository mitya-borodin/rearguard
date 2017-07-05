import AssetsPlugin from 'assets-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import {
  env,
  isAnalyze,
  isDevelopment,
  isIsomorphic,
  isProduction,
  isVerbose,
  outputServer
} from '../../prepare.build-tools.config';

export const HMR = () => {
  if (isDevelopment) {
    return [
      new webpack.HotModuleReplacementPlugin(),
      // enable HMR globally

      new webpack.NamedModulesPlugin(),
      // prints more readable module names in the browser console on HMR updates
    ];
  }

  return [];
};

// https://webpack.js.org/plugins/commons-chunk-plugin/
export const extractVendors = () => (
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: module => /node_modules/.test(module.resource),
  })
);

export const uglify = () => {
  if (isProduction) {
    return [
      // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
      new UglifyJSPlugin({
        sourceMap: true,
        compress: {
          screw_ie8: true, // React doesn't support IE8
          warnings: isVerbose,
          unused: true,
          dead_code: true,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
    ];
  }

  return [];
};

// Webpack Bundle Analyzer
// https://github.com/th0r/webpack-bundle-analyzer
export const analyze = () => {
  if (isAnalyze) {
    return [new BundleAnalyzerPlugin()];
  }

  return [];
};

// https://webpack.js.org/plugins/define-plugin/
export const defineEnv = () => (
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': env.NODE_ENV,
    'process.env.DEBUG': env.DEBUG,
    __DEV__: env.__DEV__,
    __PROD__: env.__PROD__,
    __RHL__: env.__RHL__,
  })
);

// Emit a file with assets paths
// https://github.com/sporto/assets-webpack-plugin#options
export const getAssetsFile = () => {
  if (isIsomorphic) {
    return [
      new AssetsPlugin({
        path: outputServer,
        filename: 'assets.json',
        prettyPrint: true,
      }),
    ];
  }

  return [];
};
export const getIndexHtmlFile = () => {
  if (!isIsomorphic) {
    return [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        inject: 'head',
      }),
    ];
  }

  return [];
};
