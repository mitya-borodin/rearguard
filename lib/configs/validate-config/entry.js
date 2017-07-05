'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultValue = 'main.js';
const propType = {
  entry: _joi2.default.string().trim().min(6).required()
};

exports.default = (entry, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }

  var _Joi$validate = _joi2.default.validate({ entry }, propType);

  const error = _Joi$validate.error,
        value = _Joi$validate.value;

  if (error !== null) {
    console.error(error.message);
    console.log(_chalk2.default.bold.yellow(`Current value: "${entry}"`));
    console.log(_chalk2.default.bold.cyan(`We are using: "${defaultValue}"`));
    return defaultValue;
  }
  return value.entry;
};
//# sourceMappingURL=entry.js.map