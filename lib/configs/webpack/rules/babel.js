'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prepareBuildTools = require('../../prepare.build-tools.config');

exports.default = (test = /\.(js)?$/, presets = [], plugins = [], envPreset = [], exclude = [/node_modules/]) => ({
  test,
  loader: 'babel-loader',
  exclude,
  include: [_prepareBuildTools.context],
  query: {
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
  }
});
//# sourceMappingURL=babel.js.map