'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

let bundle = (() => {
  var _ref = _asyncToGenerator(function* (webpackConfig) {
    yield new Promise(function (resolve, reject) {
      (0, _webpack2.default)(webpackConfig).run(function (err, stats) {
        if (err) {
          return reject(err);
        }

        console.info(stats.toString(_prepareBuildTools.devServer.stats));
        return resolve();
      });
    });
  });

  return function bundle(_x) {
    return _ref.apply(this, arguments);
  };
})();

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _prepareBuildTools = require('../../configs/prepare.build-tools.config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = bundle;
//# sourceMappingURL=bundle.js.map