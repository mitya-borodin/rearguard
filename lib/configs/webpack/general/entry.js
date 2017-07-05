'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serverEntry = exports.isomorphicEntry = exports.spaEntry = undefined;

var _prepareBuildTools = require('../../prepare.build-tools.config');

const spaEntry = exports.spaEntry = (entries = []) => {
  if (_prepareBuildTools.isDevelopment) {
    return [
    // http://gaearon.github.io/react-hot-loader/getstarted/
    `webpack-dev-server/client?${_prepareBuildTools.socket}`, 'webpack/hot/dev-server', ...entries, _prepareBuildTools.entry];
  }

  return _prepareBuildTools.entry;
};

const isomorphicEntry = exports.isomorphicEntry = (entries = []) => {
  if (_prepareBuildTools.isDevelopment) {
    return ['webpack-hot-middleware/client', ...entries, _prepareBuildTools.entry];
  }

  return _prepareBuildTools.entry;
};

const serverEntry = exports.serverEntry = (entries = []) => {
  return [...entries, _prepareBuildTools.entryServer];
};
//# sourceMappingURL=entry.js.map