import chalk from 'chalk';
import Joi from 'joi';

const defaultValue = {
  '/api': 'http://localhost:5000',
};
export default (proxy, getDefaultValue = false) => {
  if (getDefaultValue) {
    return defaultValue;
  }

  for (let proxyName in proxy) {
    if (proxy.hasOwnProperty(proxyName)) {
      const { error: proxyNameError } = Joi.validate(proxyName, Joi.string().trim().min(3).required());
      const { error: proxyValueError } = Joi.validate(proxy[proxyName], Joi.string().trim().min(6).required());

      if (proxyNameError !== null) {
        console.error(proxyNameError.message);
      }
      if (proxyValueError !== null) {
        console.error(proxyValueError.message);
      }
      if (proxyNameError !== null || proxyValueError !== null) {
        console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(proxy, null, 2)}"`));
        console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
        return defaultValue;
      }
    }
  }

  return proxy;
}
