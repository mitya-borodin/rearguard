'use strict';

let build = (() => {
  var _ref = _asyncToGenerator(function* () {
    yield (0, _run2.default)(_clean2.default, 'clean.react.app');
    yield (0, _run2.default)(_copy2.default, 'copy.react.app');
    yield (0, _run2.default)(_asyncToGenerator(function* () {
      return yield (0, _bundle2.default)(_infernoWebpack2.default);
    }), 'bundle.react.app');
  });

  return function build() {
    return _ref.apply(this, arguments);
  };
})();

var _infernoWebpack = require('../../configs/webpack/inferno.webpack.config');

var _infernoWebpack2 = _interopRequireDefault(_infernoWebpack);

var _bundle = require('../general/bundle');

var _bundle2 = _interopRequireDefault(_bundle);

var _clean = require('../general/clean');

var _clean2 = _interopRequireDefault(_clean);

var _copy = require('../general/copy');

var _copy2 = _interopRequireDefault(_copy);

var _run = require('../run');

var _run2 = _interopRequireDefault(_run);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(0, _run2.default)(build, 'build.react.app');
//# sourceMappingURL=build.js.map