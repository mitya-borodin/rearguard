"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const css_1 = require("./rules/css");
const files_1 = require("./rules/files");
const target_config_1 = require("./target.config");
exports.default = (entry, output, rules, plugins, externals) => ({
    bail: !target_config_1.isDevelopment,
    context: target_config_1.context,
    devtool: target_config_1.isDebug ? "source-map" : false,
    entry,
    externals,
    module: {
        rules: [...rules, ...css_1.default(), files_1.file()],
    },
    output,
    performance: {
        hints: false,
    },
    plugins,
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".css", ".json"],
        modules: target_config_1.modules,
    },
    resolveLoader: {
        extensions: [".js", ".json"],
        mainFields: ["loader", "main"],
        modules: target_config_1.modules,
    },
    stats: target_config_1.stats,
});
//# sourceMappingURL=general.webpack.config.js.map