'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

let build = (() => {
  var _ref = _asyncToGenerator(function* (webpackConfig) {
    yield (0, _run2.default)(_clean2.default, 'clean');
    yield (0, _run2.default)(_copy2.default, 'copy');
    yield (0, _run2.default)(_asyncToGenerator(function* () {
      return yield (0, _bundle2.default)(webpackConfig);
    }), 'bundle');
  });

  return function build(_x) {
    return _ref.apply(this, arguments);
  };
})();

var _run = require('../run');

var _run2 = _interopRequireDefault(_run);

var _bundle = require('./bundle');

var _bundle2 = _interopRequireDefault(_bundle);

var _clean = require('./clean');

var _clean2 = _interopRequireDefault(_clean);

var _copy = require('./copy');

var _copy2 = _interopRequireDefault(_copy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = build;
//# sourceMappingURL=build.js.map