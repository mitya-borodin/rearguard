'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractCSS = undefined;

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _prepareBuildTools = require('../../prepare.build-tools.config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const extractCSS = exports.extractCSS = () => {
  if (!_prepareBuildTools.isIsomorphic && _prepareBuildTools.isProduction) {
    return [new _extractTextWebpackPlugin2.default({ filename: '[name].[hash].css', ignoreOrder: true })];
  }

  return [];
};
//# sourceMappingURL=css.js.map