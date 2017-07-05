'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _prepareBuildTools = require('../prepare.build-tools.config');

exports.default = _extends({}, _prepareBuildTools.devServer, {
  compress: true,
  historyApiFallback: true,
  hot: true,
  https: false,
  inline: true,
  overlay: {
    errors: true
  },
  watchOptions: {
    ignored: /node_modules/
  },
  clientLogLevel: 'info',
  proxy: _prepareBuildTools.proxy
});
//# sourceMappingURL=webpack.devserver.config.js.map