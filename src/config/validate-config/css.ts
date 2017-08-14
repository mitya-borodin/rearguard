import chalk from 'chalk';
import Joi from 'joi';

interface ICSS {
  isolation: boolean;
  reset: {
    [key: string]: string;
  }
  postCssPlugins: string;
}

const defaultValue = {
  isolation: true,
  reset: {
    all: 'initial',
    display: 'block',
    'font-size': 'inherit',
    boxSizing: 'border-box',
  },
  postCssPlugins: 'postCssPlugins.js',
};
const propType = {
  css: Joi.object()
    .keys({
      isolation: Joi.boolean()
        .required(),
      reset: Joi.object()
        .required(),
      postCssPlugins: Joi.string()
        .required(),
    })
    .required(),
};

export default (css: ICSS, getDefaultValue = false): ICSS => {
  if (getDefaultValue) {
    return defaultValue;
  }
  const { error, value } = Joi.validate({ css }, propType);
  
  if (error !== null) {
    console.error(error.message);
    console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(css, null, 2)}"`));
    console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
    
    return defaultValue;
  }
  
  return value.css;
};
