#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const child_process_1 = require("child_process");
const spawn = require("cross-spawn");
const fs_1 = require("fs");
const path_1 = require("path");
const [, , action, ...otherArguments] = process.argv;
const alias = { d: "debug", r: "release" };
const { release = false, debug = false } = otherArguments.reduce((prevValue, value) => {
    if (value.indexOf("--") === 0) {
        return Object.assign(prevValue, { [value.slice(2, value.length)]: true });
    }
    else if (value.indexOf("-") === 0) {
        const flag = value.slice(1, value.length);
        if (alias.hasOwnProperty(flag)) {
            return Object.assign(prevValue, { [alias[flag]]: true });
        }
    }
    return prevValue;
}, {});
if (action === "start" || action === "build") {
    const launchFile = path_1.resolve(__dirname, "../src/launchers", `${action}.js`);
    if (fs_1.existsSync(launchFile)) {
        const GLOBAL_NODE_MODULES = child_process_1.execSync("npm root -g", { encoding: "utf8" }).replace("\n", "");
        if (!fs_1.existsSync(path_1.resolve(GLOBAL_NODE_MODULES, "rearguard"))) {
            const npm = path_1.resolve(GLOBAL_NODE_MODULES, "../../bin/npm");
            console.log(chalk_1.default.bold.cyan(`=================Rearguard================`));
            console.log(chalk_1.default.bold.cyan(`==================Install=================`));
            console.log(chalk_1.default.bold.cyan(`LAUNCH: ${npm} i -g rearguard`));
            console.log(chalk_1.default.bold.cyan(`INFO: pending may be continue around 60 - 200 seconds, it is normal because npm will be install rearguard.`));
            child_process_1.execSync(`${npm} i -g rearguard`, { stdio: "inherit" });
            console.log(chalk_1.default.bold.cyan(`RESULT: rearguard was installed here ${npm}/rearguard`));
            console.log(chalk_1.default.bold.cyan(`==========================================`));
        }
        const LOCAL_NODE_MODULES = path_1.resolve(process.cwd(), "node_modules");
        let NODE_MODULE_PATH = path_1.resolve(GLOBAL_NODE_MODULES, "rearguard/node_modules");
        if (fs_1.existsSync(path_1.resolve(LOCAL_NODE_MODULES, "rearguard"))) {
            NODE_MODULE_PATH = LOCAL_NODE_MODULES;
        }
        if (fs_1.existsSync(NODE_MODULE_PATH)) {
            process.env.REARGUARD_NODE_MODULE_PATH = NODE_MODULE_PATH;
            process.env.REARGUARD_DEBUG = debug ? "true" : "false";
            process.env.REARGUARD_LAUNCH_IS_START = action === "start" ? "true" : "false";
            process.env.REARGUARD_LAUNCH_IS_BUILD = action === "build" ? "true" : "false";
            process.env.NODE_ENV = !release ? "development" : "production";
            console.log(chalk_1.default.bold.green(`================Rearguard==============`));
            console.log(chalk_1.default.bold.green(`==================Info=================`));
            console.log(chalk_1.default.bold.green(`TYPE: ${action}`));
            console.log(chalk_1.default.bold.green(`NODE_ENV: ${process.env.NODE_ENV}`));
            console.log(chalk_1.default.bold.green(`DEBUG: ${process.env.REARGUARD_DEBUG}`));
            console.log(chalk_1.default.bold.green(`NODE_MODULES: ${NODE_MODULE_PATH}`));
            console.log(chalk_1.default.bold.green(`LAUNCH: node ${launchFile}`));
            console.log(chalk_1.default.bold.green(`=======================================`));
            const result = spawn.sync("node", [launchFile], { stdio: "inherit" });
            if (result.signal) {
                if (result.signal === "SIGKILL") {
                    console.log(chalk_1.default.red("The build failed because the process exited too early. This probably means the system ran out of memory or someone called `kill -9` on the process."));
                    process.exit(1);
                }
                else if (result.signal === "SIGTERM") {
                    console.log(chalk_1.default.bold.red("The build failed because the process exited too early. Someone might have called `kill` or `killall`, or the system could be shutting down."));
                    process.exit(1);
                }
                process.exit(0);
            }
            process.exit(result.status);
        }
        else {
            console.log(chalk_1.default.bold.red(`[REARGUARD][NODE_MODULES][NOT_FOUND]: ${NODE_MODULE_PATH}`));
            process.exit(1);
        }
    }
    else {
        console.log(chalk_1.default.bold.red(`I am really sorry but file: ${launchFile}, not found, try check this throw command: ls -la ${launchFile}`));
    }
}
else {
    console.log(chalk_1.default.bold.red("You should use: rearguard [ start | build ] [ -r | -d ]"));
}
//# sourceMappingURL=rearguard.js.map