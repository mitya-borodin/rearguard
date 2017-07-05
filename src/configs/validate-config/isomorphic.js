import chalk from 'chalk';
import Joi from 'joi';

const defaultValue = {
  entry: 'server.js',
  publicDirName: 'public',
};
const propType = {
  isomorphic: Joi.object().keys({
    entry: Joi.string().trim().min(0).required(),
    publicDirName: Joi.string().trim().min(0).required(),
  }).required(),
};

export default (isomorphic, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }
  const {error, value} = Joi.validate({isomorphic}, propType);

  if (error !== null) {
    console.error(error.message);
    console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(isomorphic, null, 2)}"`));
    console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
    return defaultValue;
  }
  return value.isomorphic;
}
