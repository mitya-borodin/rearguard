"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const target_config_1 = require("../target.config");
exports.default = (entries = []) => {
    if (target_config_1.isDevelopment && !target_config_1.isBuild) {
        return [
            `${target_config_1.resolveNodeModules("webpack-dev-server")}/client?${target_config_1.socket}`,
            `${target_config_1.resolveNodeModules("webpack")}/hot/dev-server`,
            ...entries,
            target_config_1.entry,
        ];
    }
    return target_config_1.entry;
};
//# sourceMappingURL=entry.js.map