import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import browserslist from '../validate-config/browserslist';
import context from '../validate-config/context';
import css from '../validate-config/css';
import entry from '../validate-config/entry';
import isomorphic from '../validate-config/isomorphic';
import modules from '../validate-config/modules';
import output from '../validate-config/output';
import proxy from '../validate-config/proxy';
import typescript from '../validate-config/typescript';
import socket from '../validate-config/socket';

export default () => {
  const CWD = process.cwd();
  const pkgPath = path.resolve(CWD, 'package.json');

  const buildPropTypes = {
    context,
    entry,
    output,
    modules,
    browserslist,
    proxy,
    isomorphic,
    css,
    typescript
  };

  const socketPropTypes = {
    socket,
  };

  const prepareConfig = (fileName, propTypes) => {
    const configPath = path.resolve(CWD, fileName);

    if (fs.existsSync(configPath)) {
      const config = {};
      const __config__ = require(configPath);

      for (let propName in propTypes) {
        if (propTypes.hasOwnProperty(propName)) {
          config[propName] = propTypes[propName](__config__[propName]);
          __config__[propName] = null;
          delete __config__[propName];
        }
      }

      if (Object.keys(__config__).length > 0) {
        console.log(chalk.bold.red(`This is configs not used: \n\r"${JSON.stringify(__config__, null, 2)}"`));
        console.log(chalk.bold.red(`Please remove their from build-tools.config.json`));
      }

      return config;
    } else {
      const config = {};

      for (let propName in propTypes) {
        if (propTypes.hasOwnProperty(propName)) {
          config[propName] = propTypes[propName](null, true);
        }
      }

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      return config;
    }
  };

  if (fs.existsSync(pkgPath)) {
    const pkg = require(pkgPath);
    const nodeVersion = parseFloat(pkg.engines.node.match(/(\d+\.?)+/)[0]);
    const engines = pkg.engines;
    const dependencies = pkg.dependencies;
    const buildConfig = prepareConfig('build.config.json', buildPropTypes);
    const socketConfig = prepareConfig('socket.config.json', socketPropTypes);

    return {
      ...buildConfig,
      ...socketConfig,
      nodeVersion,
      engines,
      dependencies,
    };
  } else {
    throw new Error('Не найден файл package.json, build-tools предназначен для npm пакетов, пожалуйста выполните npm init.');
  }
}
