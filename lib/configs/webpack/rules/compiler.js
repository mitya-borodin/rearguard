'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _prepareBuildTools = require('../../prepare.build-tools.config');

exports.default = ({
  babel: {
    presets = [],
    plugins = [],
    envPreset = []
  },
  exclude = [/node_modules/]
}) => {
  const common = {
    exclude,
    include: [_prepareBuildTools.context]
  };
  const babelQuery = {
    // https://github.com/babel/babel-loader#options
    cacheDirectory: _prepareBuildTools.isDevelopment,

    // https://babeljs.io/docs/usage/options/
    babelrc: false,
    // TODO как заработает внедрить https://github.com/mobxjs/babel-plugin-mobx-deep-action/issues/5
    //passPerPreset: true,
    presets: [
    // TODO как заработает внедрить https://github.com/mobxjs/babel-plugin-mobx-deep-action/issues/5
    //...isMobx ? [{ plugins: ['transform-regenerator', 'mobx-deep-action'] }] : [],
    envPreset,
    // Stage 2: draft
    // https://babeljs.io/docs/plugins/preset-stage-2/
    'stage-2', ...presets],
    plugins: [...(_prepareBuildTools.isMobx ? ['transform-decorators-legacy'] : []), ...plugins]
  };

  if (_prepareBuildTools.isTS) {
    return [_extends({}, common, {
      test: /\.(ts)?$/,
      use: [{
        loader: 'babel-loader',
        query: babelQuery
      }, {
        loader: 'ts-loader',
        options: {
          configFileName: _prepareBuildTools.tmpTypescryptConfigPath
        }
      }]
    }), _extends({}, common, {
      test: /\.(js|jsx)?$/,
      loader: 'babel-loader',
      query: babelQuery
    }), {
      test: /\.js$/,
      exclude,
      include: [_prepareBuildTools.context],
      enforce: 'pre',
      loader: 'source-map-loader'
    }];
  } else {
    return [_extends({}, common, {
      test: /\.(js|jsx)?$/,
      loader: 'babel-loader',
      query: babelQuery
    })];
  }
};
//# sourceMappingURL=compiler.js.map