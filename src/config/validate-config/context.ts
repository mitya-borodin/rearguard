import * as chalk from 'chalk';
import * as Joi from 'joi';
import { IContext } from '../../interfaces/IConfigs';
import detectConfig from './common';

const defaultValue: IContext = {
  context: 'src'
};

const propType = {
  context: Joi.string().trim().min(3).required(),
};

export default (fileName: string): IContext => {
  const { exist, value: context } = detectConfig(fileName, 'context');
  
  if (exist) {
    const { error } = Joi.validate(context, propType);
    
    if (error !== null) {
      if(process.env.REARGUARD_ERROR_LOG === 'true') {
        console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(context, null, 2)}"`));
        console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
      }
      return defaultValue;
    }
    
    return context;
  } else {
    return defaultValue;
  }
};
