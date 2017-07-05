'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.externalCSS = exports.internalCSS = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _prepareBuildTools = require('../../prepare.build-tools.config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const use = (isExternal = false) => {
  let styleLoader = [];

  if (_prepareBuildTools.isDevelopment) {
    if (_prepareBuildTools.isIsomorphic) {
      if (_prepareBuildTools.isInferno) {
        // TODO isomorphic-style-loader - не подходит так как требует наличие контекста.

        styleLoader = [];
      } else {
        styleLoader = [{
          loader: 'isomorphic-style-loader'
        }];
      }
    } else {
      styleLoader = [{
        loader: 'style-loader'
      }];
    }
  } else if (_prepareBuildTools.isIsomorphic) {
    if (_prepareBuildTools.isInferno) {
      // TODO isomorphic-style-loader - не подходит так как требует наличие контекста.

      styleLoader = [];
    } else {
      styleLoader = [{
        loader: 'isomorphic-style-loader'
      }];
    }
  }

  return [...styleLoader, {
    loader: 'css-loader',
    options: _extends({}, !isExternal ? {
      // CSS Loader https://webpack.js.org/loaders/css-loader/
      importLoaders: 1,
      localIdentName: _prepareBuildTools.isDevelopment ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:32]'
    } : {}, {
      // CSS Modules https://github.com/css-modules/css-modules
      modules: !isExternal,
      sourceMap: _prepareBuildTools.isDevelopment,
      // CSS Nano http://cssnano.co/options/
      minimize: _prepareBuildTools.isProduction,
      discardComments: {
        removeAll: true
      }
    })
  }, ...(!isExternal ? [{
    loader: 'postcss-loader',
    options: {
      plugins: _prepareBuildTools.postCssConfig
    }
  }] : [])];
};

const rules = (isExternal = false) => _extends({}, !_prepareBuildTools.isIsomorphic && _prepareBuildTools.isProduction ? {
  use: _extractTextWebpackPlugin2.default.extract({
    fallback: 'style-loader',
    use: use(isExternal),
    publicPath: _prepareBuildTools.output.publicPath
  })
} : {
  use: use(isExternal)
});

const internalCSS = exports.internalCSS = (test = /\.css/) => _extends({
  test,
  include: _prepareBuildTools.context
}, rules(false));

const externalCSS = exports.externalCSS = (test = /\.css/) => _extends({
  test,
  exclude: _prepareBuildTools.context
}, rules(true));
//# sourceMappingURL=css.js.map