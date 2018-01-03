"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const socket_1 = require("../validate-config/socket");
exports.default = (fileName = "socket.config.json") => {
    const CWD = process.cwd();
    const configPath = path.resolve(CWD, fileName);
    if (fs.existsSync(configPath)) {
        return socket_1.default(JSON.parse(fs.readFileSync(configPath, { encoding: "utf8" })));
    }
    else {
        fs.writeFileSync(configPath, JSON.stringify(socket_1.defaultValue, null, 2));
        return socket_1.defaultValue;
    }
};
//# sourceMappingURL=socket.config.js.map