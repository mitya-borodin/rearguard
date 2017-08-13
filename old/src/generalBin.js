const fs = require('fs');
const path = require('path');
const meow = require('meow');
const spawn = require('cross-spawn');
const { isString, isUndefined } = require('@techintouch/utils/lib');
const getDescription = require('./configs/utils/getDescription');
const { execSync } = require('child_process');

module.exports = (binName = 'react-app') => {
  const { input, flags: { release, verbose, analyze, debug, isomorphic, typescript, onlyServer } } = meow(
    getDescription(binName),
    {
      alias: {
        ts: 'typescript',
        i: 'isomorphic',

        v: 'verbose',
        r: 'release',
        d: 'debug',
        a: 'analyze',

        h: 'help',
      },
    },
  );

  const TOOLS_DIR = path.resolve(__dirname, '../lib/tools', binName);
  const actionName = input.length === 0 ? 'start' : input[0];
  const actionFiles = {
    start: path.resolve(TOOLS_DIR, 'start.js'),
    build: path.resolve(TOOLS_DIR, 'build.js'),
  };
  const GLOBAL_NODE_MODULES_PATH = execSync('npm root -g', { encoding: 'utf-8' }).replace('\n', '');
  const LOCAL_NODE_MODULE = path.resolve(process.cwd(), 'node_modules/rearguard/node_modules');

  let NODE_MODULE = path.resolve(GLOBAL_NODE_MODULES_PATH, 'rearguard/node_modules');

  if (fs.existsSync(LOCAL_NODE_MODULE)) {
    NODE_MODULE = LOCAL_NODE_MODULE;
  }

  process.env.NODE_ENV = !release ? 'development' : 'production';
  process.env.BUILD_TOOLS_VERBOSE = !isUndefined(verbose) ? verbose : false;
  process.env.BUILD_TOOLS_ANALYZE = !isUndefined(analyze) ? analyze : false;
  process.env.WEBPACK_DEBUG = !isUndefined(debug) ? debug : false;
  process.env.ENABLED_ISOMORPHIC = !isUndefined(isomorphic) ? isomorphic : false;
  process.env.ENABLED_TYPE_SCRIPT = !isUndefined(typescript) ? typescript : false;
  process.env.ONLY_SERVER = !isUndefined(onlyServer) ? onlyServer : false;
  process.env.BUILD_TOOLS_NODE_MODULE_PATH = NODE_MODULE;

  if (isString(actionFiles[actionName])) {
    const result = spawn.sync('node', [actionFiles[actionName]], { stdio: 'inherit' });

    if (result.signal) {
      if (result.signal === 'SIGKILL') {
        console.log(
          'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.',
        );
        process.exit(1);
      } else if (result.signal === 'SIGTERM') {
        console.log(
          'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.',
        );

        process.exit(1);
      }

      process.exit(0);
    }

    process.exit(result.status);
  } else {
    console.log(`Unknown action "${actionName}".`);
    console.log('Perhaps you need to update react-app?');

    process.exit(1);
  }
};
