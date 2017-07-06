'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _browserSync = require('browser-sync');

var _browserSync2 = _interopRequireDefault(_browserSync);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _writeFileWebpackPlugin = require('write-file-webpack-plugin');

var _writeFileWebpackPlugin2 = _interopRequireDefault(_writeFileWebpackPlugin);

var _prepareBuildTools = require('../../configs/prepare.build-tools.config');

var _prepareTypescriptConfig = require('../../configs/prepareTypescriptConfig');

var _prepareTypescriptConfig2 = _interopRequireDefault(_prepareTypescriptConfig);

var _runServer = require('../../configs/utils/runServer');

var _runServer2 = _interopRequireDefault(_runServer);

var _webpackDevserver = require('../../configs/webpack/webpack.devserver.config');

var _webpackDevserver2 = _interopRequireDefault(_webpackDevserver);

var _run = require('../run');

var _run2 = _interopRequireDefault(_run);

var _clean = require('./clean');

var _clean2 = _interopRequireDefault(_clean);

var _copy = require('./copy');

var _copy2 = _interopRequireDefault(_copy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function start(webpackConfig) {
  (0, _prepareTypescriptConfig2.default)();

  if (_prepareBuildTools.isIsomorphic) {
    (0, _run2.default)(_clean2.default).then(() => (0, _run2.default)(_copy2.default)).then(() => {
      var _webpackConfig = _slicedToArray(webpackConfig, 2);

      const serverConfig = _webpackConfig[1];

      // Save the server-side bundle files to the file system after compilation
      // https://github.com/webpack/webpack-dev-server/issues/62

      serverConfig.plugins.push(new _writeFileWebpackPlugin2.default({ log: _prepareBuildTools.isDebug }));

      const bundler = (0, _webpack2.default)(webpackConfig);
      const wpMiddleware = (0, _webpackDevMiddleware2.default)(bundler, _webpackDevserver2.default);
      const hotMiddleware = (0, _webpackHotMiddleware2.default)(bundler.compilers[0], _webpackDevserver2.default);

      let handleBundleComplete = () => {
        handleBundleComplete = stats => !stats.stats[1].compilation.errors.length && (0, _runServer2.default)();

        const target = `${_prepareBuildTools.host}:${_prepareBuildTools.port}`;

        (0, _runServer2.default)(target).then(() => {
          const bs = _browserSync2.default.create();

          bs.init(_extends({}, _prepareBuildTools.isDevelopment ? {} : { notify: _prepareBuildTools.isDebug, ui: _prepareBuildTools.isDebug }, {

            proxy: {
              target,
              middleware: [(0, _compression2.default)(), wpMiddleware, hotMiddleware],
              proxyOptions: {
                xfwd: true
              }
            }
          }));
        });
      };

      bundler.plugin('done', stats => handleBundleComplete(stats));
    }, error => {
      console.error(error);
    });
  } else {
    const server = new _webpackDevServer2.default((0, _webpack2.default)(webpackConfig), _webpackDevserver2.default);

    server.listen(_prepareBuildTools.port, _prepareBuildTools.host, () => console.log(`Launched on ${_prepareBuildTools.socket}`));
  }
}

exports.default = start;
//# sourceMappingURL=start.js.map