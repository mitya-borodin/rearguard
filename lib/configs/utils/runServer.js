'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _prepareBuildTools = require('../../configs/prepare.build-tools.config');

var _prepareBuildTools2 = require('../prepare.build-tools.config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let server;
let pending = true;
const serverPath = _path2.default.join(_prepareBuildTools2.outputServer, _prepareBuildTools2.entryServer);

function turnOff() {
  if (server) {
    server.kill('SIGTERM');
  }
}

function runServer(host) {
  if (_prepareBuildTools2.isIsomorphic) {
    if (!_fs2.default.existsSync(serverPath)) {
      const message = `
		!!! [WANTED][SERVER_FILE][NOT_FOUNT][${_chalk2.default.bold.cyan(serverPath)}] !!!
		`;

      console.log(_chalk2.default.bold.yellow(message));

      return Promise.resolve(message);
    }

    return new Promise(resolve => {
      function onStdOut(data) {
        const time = new Date().toTimeString();
        const wasRun = data.toString('utf8').indexOf(_prepareBuildTools.serverWasRunDetectString) !== -1;

        process.stdout.write(time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, '[$1] '));
        process.stdout.write(data);

        if (wasRun) {
          server.host = host;
          server.stdout.removeListener('data', onStdOut);
          server.stdout.on('data', x => process.stdout.write(x));
          pending = false;
          resolve(server);
        }
      }

      turnOff();

      server = _child_process2.default.spawn('node', [serverPath], {
        env: Object.assign({ NODE_ENV: 'development' }, process.env)
      });

      if (pending) {
        server.once('exit', (code, signal) => {
          if (pending) {
            throw new Error(`Server terminated unexpectedly with code: ${code} signal: ${signal}`);
          }
        });
      }

      server.stdout.on('data', onStdOut);
      server.stderr.on('data', x => process.stderr.write(x));

      return server;
    });
  } else {
    const message = `
		!!! [WANTED][TRY][RUN_SERVER_IN_SPA_MODE][${_chalk2.default.bold.cyan(serverPath)}] !!!
		`;

    console.log(_chalk2.default.bold.red(message));

    return Promise.reject(message);
  }
}

process.on('exit', turnOff);

exports.default = runServer;
//# sourceMappingURL=runServer.js.map