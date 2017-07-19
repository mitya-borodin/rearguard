import chalk from 'chalk';
import Joi from 'joi';

const defaultValue = 'src';
const propType = {
  context: Joi.string().trim().min(3).required(),
};

export default (context, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }
  const { error, value } = Joi.validate({ context }, propType);
  if (error !== null) {
    console.error(error.message);
    console.log(chalk.bold.yellow(`Current value: "${context}"`));
    console.log(chalk.bold.cyan(`We are using: "${defaultValue}"`));
    return defaultValue;
  }
  return value.context;
}
