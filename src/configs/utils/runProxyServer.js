import cp from 'child_process';
import { host, port, serverWasRunDetectString } from '../../configs/prepare.build-tools.config';
import { proxyServer } from '../prepare.build-tools.config';

let server;
let pending = true;

function turnOff () {
  if (server) {
    server.kill('SIGTERM');
  }
}

function runProxyServer () {
  return new Promise((resolve) => {
    function onStdOut (data) {
      const time = new Date().toTimeString();
      const wasRun = data.toString('utf8').indexOf(serverWasRunDetectString) !== -1;

      process.stdout.write(time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, '[$1] '));
      process.stdout.write(data);

      if (wasRun) {
        server.host = `${host}:${port}`;
        server.stdout.removeListener('data', onStdOut);
        server.stdout.on('data', x => process.stdout.write(x));
        pending = false;
        resolve(server);
      }
    }

    turnOff();

    server = cp.spawn('node', [proxyServer.serverFile], {
      env: Object.assign({ NODE_ENV: 'development' }, process.env),
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
}

process.on('exit', turnOff);

export default runProxyServer;
