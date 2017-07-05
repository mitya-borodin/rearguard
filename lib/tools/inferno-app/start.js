'use strict';

var _generateTSConfig = require('../../configs/generateTSConfig');

var _generateTSConfig2 = _interopRequireDefault(_generateTSConfig);

var _prepareBuildTools = require('../../configs/prepare.build-tools.config');

var _infernoWebpack = require('../../configs/webpack/inferno.webpack.config');

var _infernoWebpack2 = _interopRequireDefault(_infernoWebpack);

var _start = require('../general/start');

var _start2 = _interopRequireDefault(_start);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_prepareBuildTools.isTS) {
  (0, _generateTSConfig2.default)();
}

(0, _start2.default)(_infernoWebpack2.default);
//# sourceMappingURL=start.js.map