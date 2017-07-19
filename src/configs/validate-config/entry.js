import chalk from 'chalk';
import Joi from 'joi';

const defaultValue = 'main.js';
const propType = {
  entry: Joi.string().trim().min(6).required(),
};

export default (entry, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }
  const { error, value } = Joi.validate({ entry }, propType);
  if (error !== null) {
    console.error(error.message);
    console.log(chalk.bold.yellow(`Current value: "${entry}"`));
    console.log(chalk.bold.cyan(`We are using: "${defaultValue}"`));
    return defaultValue;
  }
  return value.entry;
}
