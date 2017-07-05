'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

let copy = (() => {
  var _ref = _asyncToGenerator(function* () {
    if (_prepareBuildTools.isIsomorphic) {
      yield (0, _fs.makeDir)(_prepareBuildTools.outputServer);
      yield (0, _fs.writeFile)(_path2.default.resolve(_prepareBuildTools.outputServer, 'package.json'), JSON.stringify({
        private: true,
        engines: _prepareBuildTools.engines,
        dependencies: _prepareBuildTools.dependencies,
        scripts: {
          start: 'node server.js'
        }
      }, null, 2));
      yield (0, _fs.writeFile)(_path2.default.resolve(_prepareBuildTools.outputServer, 'config.json'), JSON.stringify({
        port: _prepareBuildTools.port,
        host: _prepareBuildTools.host,
        serverWasRunDetectString: _prepareBuildTools.serverWasRunDetectString,
        proxy: Object.keys(_prepareBuildTools.proxy).map(function (key) {
          return {
            route: key,
            target: _prepareBuildTools.proxy[key]
          };
        })
      }, null, 2));
      yield (0, _fs.copyDir)(_path2.default.resolve(_prepareBuildTools.context, `../${_prepareBuildTools.publicDirName}`), _path2.default.resolve(_prepareBuildTools.outputServer, _prepareBuildTools.publicDirName));
    } else {
      yield (0, _fs.copyDir)(_path2.default.resolve(_prepareBuildTools.context, `../${_prepareBuildTools.publicDirName}`), _path2.default.resolve(_prepareBuildTools.outputServer));
    }
  });

  return function copy() {
    return _ref.apply(this, arguments);
  };
})();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _prepareBuildTools = require('../../configs/prepare.build-tools.config');

var _fs = require('../lib/fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = copy;
//# sourceMappingURL=copy.js.map