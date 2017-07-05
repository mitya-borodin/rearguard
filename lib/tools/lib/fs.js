'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanDir = exports.copyDir = exports.moveDir = exports.makeDir = exports.readDir = exports.copyFile = exports.renameFile = exports.writeFile = exports.readFile = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const readFile = exports.readFile = file => new Promise((resolve, reject) => {
  _fs2.default.readFile(file, 'utf8', (err, data) => err ? reject(err) : resolve(data));
});

const writeFile = exports.writeFile = (file, contents) => new Promise((resolve, reject) => {
  _fs2.default.writeFile(file, contents, 'utf8', err => err ? reject(err) : resolve());
});

const renameFile = exports.renameFile = (source, target) => new Promise((resolve, reject) => {
  _fs2.default.rename(source, target, err => err ? reject(err) : resolve());
});

const copyFile = exports.copyFile = (source, target) => new Promise((resolve, reject) => {
  let cbCalled = false;

  function done(err) {
    if (!cbCalled) {
      cbCalled = true;
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }
  }

  const rd = _fs2.default.createReadStream(source);
  rd.on('error', err => done(err));
  const wr = _fs2.default.createWriteStream(target);
  wr.on('error', err => done(err));
  wr.on('close', err => done(err));
  rd.pipe(wr);
});

const readDir = exports.readDir = (pattern, options) => new Promise((resolve, reject) => (0, _glob2.default)(pattern, options, (err, result) => err ? reject(err) : resolve(result)));

const makeDir = exports.makeDir = name => new Promise((resolve, reject) => {
  (0, _mkdirp2.default)(name, err => err ? reject(err) : resolve());
});

const moveDir = exports.moveDir = (() => {
  var _ref = _asyncToGenerator(function* (source, target) {
    const dirs = yield readDir('**/*.*', {
      cwd: source,
      nosort: true,
      dot: true
    });
    yield Promise.all(dirs.map((() => {
      var _ref2 = _asyncToGenerator(function* (dir) {
        const from = _path2.default.resolve(source, dir);
        const to = _path2.default.resolve(target, dir);
        yield makeDir(_path2.default.dirname(to));
        yield renameFile(from, to);
      });

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    })()));
  });

  return function moveDir(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const copyDir = exports.copyDir = (() => {
  var _ref3 = _asyncToGenerator(function* (source, target) {
    const dirs = yield readDir('**/*.*', {
      cwd: source,
      nosort: true,
      dot: true
    });

    yield Promise.all(dirs.map((() => {
      var _ref4 = _asyncToGenerator(function* (dir) {
        const from = _path2.default.resolve(source, dir);
        const to = _path2.default.resolve(target, dir);
        yield makeDir(_path2.default.dirname(to));
        yield copyFile(from, to);
      });

      return function (_x6) {
        return _ref4.apply(this, arguments);
      };
    })()));
  });

  return function copyDir(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
})();

const cleanDir = exports.cleanDir = (pattern, options) => new Promise((resolve, reject) => (0, _rimraf2.default)(pattern, { glob: options }, (err, result) => err ? reject(err) : resolve(result)));

exports.default = {
  readFile,
  writeFile,
  renameFile,
  copyFile,
  readDir,
  makeDir,
  copyDir,
  moveDir,
  cleanDir
};
//# sourceMappingURL=fs.js.map