import chalk from 'chalk';
import Joi from 'joi';

const defaultValue = [
  '>0.1%',
  'last 2 versions',
  'not ie <= 11',
];
const propType = {
  browserslist: Joi.array().items(Joi.string()).min(1).required(),
};

export default (browserslist: string[], getDefaultValue = false): string[] => {
  if (getDefaultValue) {
    return defaultValue;
  }
  const { error, value } = Joi.validate({ browserslist }, propType);

  if (error !== null) {
    console.error(error.message);
    console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(browserslist, null, 2)}"`));
    console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
    return defaultValue;
  }
  return value.browserslist;
};
