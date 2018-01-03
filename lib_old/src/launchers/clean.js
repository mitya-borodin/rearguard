"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const target_config_1 = require("../config/target.config");
const fs_1 = require("../lib/fs");
function clean() {
    return Promise.all([
        fs_1.cleanDir(path.resolve(target_config_1.isIsomorphic || target_config_1.staticServer ? target_config_1.servercOutput : target_config_1.output.path, "*"), {
            dot: true,
            ignore: [path.resolve(target_config_1.output.path, ".git")],
            nosort: true,
        }),
    ]);
}
exports.default = clean;
//# sourceMappingURL=clean.js.map