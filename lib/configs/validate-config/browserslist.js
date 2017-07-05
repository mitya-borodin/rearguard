'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultValue = ['>0.1%', 'last 2 versions', 'not ie <= 11'];
const propType = {
  browserslist: _joi2.default.array().items(_joi2.default.string()).min(1).required()
};

exports.default = (browserslist, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }

  var _Joi$validate = _joi2.default.validate({ browserslist }, propType);

  const error = _Joi$validate.error,
        value = _Joi$validate.value;


  if (error !== null) {
    console.error(error.message);
    console.log(_chalk2.default.bold.yellow(`Current value: "${JSON.stringify(browserslist, null, 2)}"`));
    console.log(_chalk2.default.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
    return defaultValue;
  }
  return value.browserslist;
};
//# sourceMappingURL=browserslist.js.map