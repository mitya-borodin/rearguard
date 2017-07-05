'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultValue = {
  '/api': 'http://localhost:5000'
};

exports.default = (proxy, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }

  for (let proxyName in proxy) {
    if (proxy.hasOwnProperty(proxyName)) {
      var _Joi$validate = _joi2.default.validate(proxyName, _joi2.default.string().trim().min(3).required());

      const proxyNameError = _Joi$validate.error;

      var _Joi$validate2 = _joi2.default.validate(proxy[proxyName], _joi2.default.string().trim().min(6).required());

      const proxyValueError = _Joi$validate2.error;


      if (proxyNameError !== null) {
        console.error(proxyNameError.message);
      }
      if (proxyValueError !== null) {
        console.error(proxyValueError.message);
      }
      if (proxyNameError !== null || proxyValueError !== null) {
        console.log(_chalk2.default.bold.yellow(`Current value: "${JSON.stringify(proxy, null, 2)}"`));
        console.log(_chalk2.default.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
        return defaultValue;
      }
    }
  }

  return proxy;
};
//# sourceMappingURL=proxy.js.map