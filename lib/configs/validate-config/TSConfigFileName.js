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
  configPath: 'tsconfig.json',
  showConfigForIDE: true,
  config: {
    compilerOptions: {},
    compileOnSave: false
  }
};
const propType = {
  typescript: _joi2.default.object().keys({
    configPath: _joi2.default.string().trim().min(0).required(),
    showConfigForIDE: _joi2.default.boolean().required(),
    config: _joi2.default.object().keys({
      compilerOptions: _joi2.default.object(),
      compileOnSave: _joi2.default.boolean()
    })
  }).required()
};

exports.default = (typescript, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }

  var _Joi$validate = _joi2.default.validate({ typescript }, propType);

  const error = _Joi$validate.error,
        value = _Joi$validate.value;


  if (error !== null) {
    console.error(error.message);
    console.log(_chalk2.default.bold.yellow(`Current value: "${JSON.stringify(typescript, null, 2)}"`));
    console.log(_chalk2.default.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
    return defaultValue;
  }
  return value.typescript;
};
//# sourceMappingURL=typescript.js.map
