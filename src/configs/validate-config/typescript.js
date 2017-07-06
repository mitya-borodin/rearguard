import chalk from 'chalk';
import Joi from 'joi';

const defaultValue = {
  configPath: 'tsconfig.json',
  showConfigForIDE: true,
  config: {
    compilerOptions: {},
    compileOnSave: false,
  }
};
const propType = {
  typescript: Joi.object().keys({
    configPath: Joi.string().trim().min(0).required(),
    showConfigForIDE: Joi.boolean().required(),
    config: Joi.object().keys({
      compilerOptions: Joi.object(),
      compileOnSave: Joi.boolean()
    })
}).required(),
};

export default (typescript, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }
  const {error, value} = Joi.validate({typescript}, propType);

  if (error !== null) {
    console.error(error.message);
    console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(typescript, null, 2)}"`));
    console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
    return defaultValue;
  }
  return value.typescript;
}
