'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _prepareBuildTools = require('../../configs/prepare.build-tools.config');

var _fs = require('../lib/fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function clean() {
  return Promise.all([(0, _fs.cleanDir)(_path2.default.resolve(_prepareBuildTools.isIsomorphic ? _prepareBuildTools.outputServer : _prepareBuildTools.output.path, '*'), {
    nosort: true,
    dot: true,
    ignore: [_path2.default.resolve(_prepareBuildTools.output.path, '.git')]
  })]);
}

exports.default = clean;
//# sourceMappingURL=clean.js.map