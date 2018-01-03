"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs = require("fs");
const path = require("path");
const context_1 = require("../validate-config/context");
const css_1 = require("../validate-config/css");
const entry_1 = require("../validate-config/entry");
const modules_1 = require("../validate-config/modules");
const output_1 = require("../validate-config/output");
const proxy_1 = require("../validate-config/proxy");
const typescript_1 = require("../validate-config/typescript");
exports.default = () => {
    const fileName = "build.config.json";
    const configPath = path.resolve(process.cwd(), fileName);
    const config = Object.assign({}, context_1.default(fileName), entry_1.default(fileName), modules_1.default(fileName), output_1.default(fileName), css_1.default(fileName), proxy_1.default(fileName), typescript_1.default(fileName));
    if (fs.existsSync(configPath)) {
        const CONFIG = require(configPath);
        for (const key in config) {
            if (CONFIG.hasOwnProperty(key)) {
                delete CONFIG[key];
            }
        }
        if (Object.keys(CONFIG).length > 0) {
            console.log(chalk_1.default.bold.red(`This is configs not used: \n\r"${JSON.stringify(CONFIG, null, 2)}"`));
            console.log(chalk_1.default.bold.red("Please remove their from build.config.json"));
        }
    }
    else {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }
    return config;
};
//# sourceMappingURL=build.config.js.map