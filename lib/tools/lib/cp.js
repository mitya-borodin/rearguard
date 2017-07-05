'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exec = exports.spawn = undefined;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const spawn = exports.spawn = (command, args, options) => new Promise((resolve, reject) => {
  _child_process2.default.spawn(command, args, options).on('close', code => {
    if (code === 0) {
      resolve();
    } else {
      reject(new Error(`${command} ${args.join(' ')} => ${code} (error)`));
    }
  });
});

const exec = exports.exec = (command, options) => new Promise((resolve, reject) => {
  _child_process2.default.exec(command, options, (err, stdout, stderr) => {
    if (err) {
      reject(err);
      return;
    }

    resolve({ stdout, stderr });
  });
});

exports.default = { spawn, exec };
//# sourceMappingURL=cp.js.map