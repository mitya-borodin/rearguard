import chalk from 'chalk';
import cp from 'child_process';
import fs from 'fs';
import path from 'path';
import { serverWasRunDetectString } from '../../configs/prepare.build-tools.config';
import { entryServer, isIsomorphic, outputServer } from '../prepare.build-tools.config';

let server;
let pending = true;
const serverPath = path.join(outputServer, entryServer);

function turnOff () {
  if (server) {
    server.kill('SIGTERM');
  }
}

function runServer (host) {
  if (isIsomorphic) {
    if (!fs.existsSync(serverPath)) {
      const message = `
		!!! [WANTED][SERVER_FILE][NOT_FOUNT][${chalk.bold.cyan(serverPath)}] !!!
		`;

      console.log(chalk.bold.yellow(message));

      return Promise.resolve(message);
    }

    return new Promise((resolve) => {
      function onStdOut (data) {
        const time = new Date().toTimeString();
        const wasRun = data.toString('utf8').indexOf(serverWasRunDetectString) !== -1;

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

      server = cp.spawn('node', [serverPath], {
        env: Object.assign({NODE_ENV: 'development'}, process.env),
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
		!!! [WANTED][TRY][RUN_SERVER_IN_SPA_MODE][${chalk.bold.cyan(serverPath)}] !!!
		`;

    console.log(chalk.bold.red(message));

    return Promise.reject(message);
  }
}

process.on('exit', turnOff);

export default runServer;
