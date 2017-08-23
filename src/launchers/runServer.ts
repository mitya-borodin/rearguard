import * as chalk from "chalk";
import * as cp from "child_process";
import * as fs from "fs";
import * as path from "path";
import { isIsomorphic, servercOutput, serverEntry, serverWasRunDetectString } from "../config/target.config";

let server: any;
let pending = true;
const serverPath = path.join(servercOutput, serverEntry);

function turnOff() {
  if (server) {
    server.kill("SIGTERM");
  }
}

function runServer(host: string) {
  if (isIsomorphic) {
    if (!fs.existsSync(serverPath)) {
      const message = `\r\n!!! [WANTED][SERVER_FILE][NOT_FOUNT][${chalk.bold.cyan(serverPath)}] !!!\r\n`;

      console.log(chalk.bold.yellow(message));

      return Promise.resolve(message);
    }

    return new Promise((resolve) => {
      function onStdOut(data: Buffer) {
        const time = new Date().toTimeString();
        const wasRun = data.toString("utf8").indexOf(serverWasRunDetectString) !== -1;

        process.stdout.write(time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, "[$1] "));
        process.stdout.write(data);

        if (wasRun) {
          server.host = host;
          server.stdout.removeListener("data", onStdOut);
          server.stdout.on("data", (x: any) => process.stdout.write(x));
          pending = false;
          resolve(server);
        }
      }

      turnOff();

      server = cp.spawn("node", [serverPath], {
        env: Object.assign({ NODE_ENV: "development" }, process.env),
      });

      if (pending) {
        server.once("exit", (code: number, signal: string) => {
          if (pending) {
            throw new Error(`Server terminated unexpectedly with code: ${code} signal: ${signal}`);
          }
        });
      }

      server.stdout.on("data", onStdOut);
      server.stderr.on("data", (x: any) => process.stderr.write(x));

      return server;
    });
  }
  const message = `\r\n!!! [WANTED][SERVER_FILE][NOT_FOUNT][${chalk.bold.cyan(serverPath)}] !!!\r\n`;

  console.log(chalk.bold.red(message));

  return Promise.reject(message);
}

process.on("exit", turnOff);

export default runServer;
