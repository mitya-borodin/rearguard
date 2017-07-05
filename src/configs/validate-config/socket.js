import chalk from 'chalk';
import Joi from 'joi';

const defaultValue = {
  port: '3000',
  host: 'localhost',
};
const propType = {
  socket: Joi.object().keys({
    port: Joi.string().trim().min(4).required(),
    host: Joi.string().trim().min(0).required(),
  }).required(),
};

export default (socket, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }
  const {error, value} = Joi.validate({socket}, propType);

  if (error !== null) {
    console.error(error.message);
    console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(socket, null, 2)}"`));
    console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
    return defaultValue;
  }
  return value.socket;
}
