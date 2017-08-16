import * as chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { IBuildConfig } from '../../interfaces/IConfigs';
import browserslist from '../validate-config/browserslist';
import context from '../validate-config/context';
import css from '../validate-config/css';
import entry from '../validate-config/entry';
import isomorphic from '../validate-config/isomorphic';
import modules from '../validate-config/modules';
import output from '../validate-config/output';
import proxy from '../validate-config/proxy';
import typescript from '../validate-config/typescript';

export default (): IBuildConfig => {
  const fileName = 'build.config.json';
  const configPath = path.resolve(process.cwd(), fileName);
  
  const config: IBuildConfig = {
    ...context(fileName),
    ...entry(fileName),
    ...output(fileName),
    ...modules(fileName),
    ...css(fileName),
    ...isomorphic(fileName),
    ...proxy(fileName),
    ...typescript(fileName),
    ...browserslist(fileName),
  };
  
  if (fs.existsSync(configPath)) {
    const _config_ = require(configPath);
    
    for (let key in config) {
      delete _config_[key];
    }
    
    if (Object.keys(_config_).length > 0) {
      console.log(chalk.bold.red(`This is configs not used: \n\r"${JSON.stringify(_config_, null, 2)}"`));
      console.log(chalk.bold.red('Please remove their from build.config.json'));
    }
  } else {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
  
  return config;
};
