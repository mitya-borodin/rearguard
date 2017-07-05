import chalk from 'chalk';
import Joi from 'joi';

const defaultValue = [
  'src',
];
const propType = {
  modules: Joi.array().items(Joi.string().trim().min(1).required()).min(1).required(),
};

export default (modules, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }
  const {error, value} = Joi.validate({modules}, propType);

  if (error !== null) {

    console.error(error.message);
    console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(modules, null, 2)}"`));
    console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));

    return defaultValue;
  }
  return value.modules;
}
