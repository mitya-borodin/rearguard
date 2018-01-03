"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const target_config_1 = require("../config/target.config");
let server;
let pending = true;
const serverPath = path.join(target_config_1.servercOutput, target_config_1.serverEntry);
function turnOff() {
    if (server) {
        server.kill("SIGTERM");
    }
}
function runServer(host) {
    const message = `\r\n!!! [WANTED][SERVER_FILE][NOT_FOUNT][${chalk_1.default.bold.cyan(serverPath)}] !!!\r\n`;
    if (target_config_1.isIsomorphic) {
        if (!fs.existsSync(serverPath)) {
            console.log(chalk_1.default.bold.yellow(message));
            return Promise.resolve(message);
        }
        return new Promise((resolve) => {
            function onStdOut(data) {
                const time = new Date().toTimeString();
                const wasRun = data.toString("utf8").indexOf(process.env.SERVER_LAUNCH_MESSAGE || "") !== -1;
                process.stdout.write(time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, "[$1] "));
                process.stdout.write(data);
                if (wasRun) {
                    server.host = host;
                    server.stdout.removeListener("data", onStdOut);
                    server.stdout.on("data", (x) => process.stdout.write(x));
                    pending = false;
                    resolve(server);
                }
            }
            turnOff();
            server = cp.spawn("node", [serverPath], {
                env: Object.assign({ NODE_ENV: "development" }, process.env),
            });
            if (pending) {
                server.once("exit", (code, signal) => {
                    if (pending) {
                        throw new Error(`Server terminated unexpectedly with code: ${code} signal: ${signal}`);
                    }
                });
            }
            server.stdout.on("data", onStdOut);
            server.stderr.on("data", (x) => process.stderr.write(x));
            return server;
        });
    }
    console.log(chalk_1.default.bold.red(message));
    return Promise.reject(message);
}
process.on("exit", turnOff);
exports.default = runServer;
//# sourceMappingURL=runServer.js.map