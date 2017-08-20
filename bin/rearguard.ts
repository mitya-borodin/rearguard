#!/usr/bin/env node

import * as chalk from 'chalk';
import { execSync } from 'child_process';
import * as spawn from 'cross-spawn';
import { existsSync } from 'fs';
import { resolve } from 'path';

interface IBoolObj {
  [key: string]: boolean
}

const [, , appType, action, ...otherArguments] = process.argv;

const alias: { [key: string]: string } = {
  ts: 'typescript',
  i: 'isomorphic',
  v: 'verbose',
  r: 'release',
  d: 'debug',
  a: 'analyze',
  h: 'help',
};

const {
  onlyServer = false,
  typescript = false,
  isomorphic = false,
  release = false,
  debug = false,
  analyze = false,
  verbose = false,
}: IBoolObj = otherArguments.reduce((prevValue: IBoolObj, value: string): IBoolObj => {
  if (value.indexOf('--') === 0) {
    return Object.assign(prevValue, { [value.slice(2, value.length)]: true });
  } else if (value.indexOf('-') === 0) {
    const flag: string = value.slice(1, value.length);
    
    if (alias.hasOwnProperty(flag)) {
      return Object.assign(prevValue, { [alias[flag]]: true });
    }
  }
  
  return prevValue;
}, {});

if (
  (action === 'start' || action === 'build') &&
  (appType === 'react' || appType === 'infernojs')
) {
  const launch_file: string = resolve(__dirname, '../src/launchers', `${action}.js`);
  
  if (existsSync(launch_file)) {
    const global_node_modules: string = execSync('npm root -g', { encoding: 'utf8' }).replace('\n', '');
    const local_node_modules: string = resolve(process.cwd(), 'node_modules');
    let node_modules_path = resolve(global_node_modules, 'rearguard/node_modules');
  
    if (existsSync(resolve(local_node_modules, 'rearguard'))) {
      node_modules_path = local_node_modules;
    }
    
    process.env.NODE_ENV = !release ? 'development' : 'production';
    process.env.REARGUARD_NODE_MODULE_PATH = node_modules_path;
    process.env.REARGUARD_ISOMORPHIC = isomorphic ? 'true' : 'false';
    process.env.REARGUARD_TYPE_SCRIPT = typescript ? 'true' : 'false';
    process.env.REARGUARD_ONLY_SERVER = onlyServer ? 'true' : 'false';
    process.env.REARGUARD_VERBOSE = verbose ? 'true' : 'false';
    process.env.REARGUARD_ANALYZE = analyze ? 'true' : 'false';
    process.env.REARGUARD_DEBUG = debug ? 'true' : 'false';
  
    process.env.REARGUARD_INFERNO_JS = appType === 'infernojs' ? 'true': 'false';
    process.env.REARGUARD_REACT = appType === 'react' ? 'true': 'false';
    
    process.env.REARGUARD_ERROR_LOG = 'true';
    
    const result = spawn.sync('node', [launch_file], { stdio: 'inherit' });
    
    if (result.signal) {
      if (result.signal === 'SIGKILL') {
        console.log(
          chalk
            .bold
            .red(
              'The build failed because the process exited too early. ' +
              'This probably means the system ran out of memory or someone called ' +
              '`kill -9` on the process.'
            ),
        );
        process.exit(1);
      } else if (result.signal === 'SIGTERM') {
        console.log(
          chalk
            .bold
            .red(
              'The build failed because the process exited too early. ' +
              'Someone might have called `kill` or `killall`, or the system could ' +
              'be shutting down.'
            ),
        );
        
        process.exit(1);
      }
      
      process.exit(0);
    }
    
    process.exit(result.status);
  } else {
    console.log(
      chalk
        .bold
        .red(`I am really sorry but file: ${launch_file}, not found, try check this throw command: ls -la ${launch_file}`)
    );
  }
} else {
  console.log(
    chalk
      .bold
      .red('You should use: rearguard [ react | infernojs ] [ start | build ] [ -ts | -i | -v | -r | -d | -a | -h ]')
  );
}
