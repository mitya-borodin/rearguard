'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _browserslist = require('../validate-config/browserslist');

var _browserslist2 = _interopRequireDefault(_browserslist);

var _context = require('../validate-config/context');

var _context2 = _interopRequireDefault(_context);

var _css = require('../validate-config/css');

var _css2 = _interopRequireDefault(_css);

var _entry = require('../validate-config/entry');

var _entry2 = _interopRequireDefault(_entry);

var _isomorphic = require('../validate-config/isomorphic');

var _isomorphic2 = _interopRequireDefault(_isomorphic);

var _modules = require('../validate-config/modules');

var _modules2 = _interopRequireDefault(_modules);

var _output = require('../validate-config/output');

var _output2 = _interopRequireDefault(_output);

var _proxy = require('../validate-config/proxy');

var _proxy2 = _interopRequireDefault(_proxy);

var _socket = require('../validate-config/socket');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = () => {
  const CWD = process.cwd();
  const pkgPath = _path2.default.resolve(CWD, 'package.json');

  const propTypes = {
    context: _context2.default,
    entry: _entry2.default,
    output: _output2.default,
    modules: _modules2.default,
    socket: _socket2.default,
    browserslist: _browserslist2.default,
    proxy: _proxy2.default,
    isomorphic: _isomorphic2.default,
    css: _css2.default
  };

  if (_fs2.default.existsSync(pkgPath)) {
    const configPath = _path2.default.resolve(CWD, 'build-tools.config.json');
    const pkg = require(pkgPath);
    const nodeVersion = parseFloat(pkg.engines.node.match(/(\d+\.?)+/)[0]);
    const engines = pkg.engines;
    const dependencies = pkg.dependencies;

    if (_fs2.default.existsSync(configPath)) {
      const __config__ = require(configPath);
      const config = {
        nodeVersion,
        engines,
        dependencies
      };

      for (let propName in propTypes) {
        if (propTypes.hasOwnProperty(propName)) {
          config[propName] = propTypes[propName](__config__[propName]);
          __config__[propName] = null;
          delete __config__[propName];
        }
      }

      if (Object.keys(__config__).length > 0) {
        console.log(_chalk2.default.bold.red(`This is configs not used: \n\r"${JSON.stringify(__config__, null, 2)}"`));
        console.log(_chalk2.default.bold.red(`Please remove their from build-tools.config.json`));
      }

      return config;
    } else {
      const config = {};

      for (let propName in propTypes) {
        if (propTypes.hasOwnProperty(propName)) {
          config[propName] = propTypes[propName](null, true);
        }
      }

      _fs2.default.writeFileSync(configPath, JSON.stringify(config, null, 2));

      return _extends({}, config, {
        nodeVersion,
        engines,
        dependencies
      });
    }
  } else {
    throw new Error('Не найден файл package.json, build-tools предназначен для npm пакетов, пожалуйста выполните npm init.');
  }
};
//# sourceMappingURL=getConfig.js.map