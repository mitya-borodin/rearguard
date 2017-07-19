import chalk from 'chalk';
import Joi from 'joi';

const defaultValue = {
  path: 'dist',
  publicPath: '/',
};
const propType = {
  output: Joi.object().keys({
    path: Joi.string().trim().min(0).required(),
    publicPath: Joi.string().trim().min(0).required(),
  }).required(),
};

export default (output, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }
  const { error, value } = Joi.validate({ output }, propType);

  if (error !== null) {
    console.error(error.message);
    console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(output, null, 2)}"`));
    console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
    return defaultValue;
  }
  return value.output;
}
