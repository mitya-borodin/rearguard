'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultValue = 'src';
const propType = {
  context: _joi2.default.string().trim().min(3).required()
};

exports.default = (context, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }

  var _Joi$validate = _joi2.default.validate({ context }, propType);

  const error = _Joi$validate.error,
        value = _Joi$validate.value;

  if (error !== null) {
    console.error(error.message);
    console.log(_chalk2.default.bold.yellow(`Current value: "${context}"`));
    console.log(_chalk2.default.bold.cyan(`We are using: "${defaultValue}"`));
    return defaultValue;
  }
  return value.context;
};
//# sourceMappingURL=context.js.map