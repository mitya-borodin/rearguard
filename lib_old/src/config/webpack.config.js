"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_1 = require("config/plugins/js");
const general_webpack_config_1 = require("./general.webpack.config");
const entry_1 = require("./general/entry");
const css_1 = require("./plugins/css");
const js_2 = require("./plugins/js");
const compiler_1 = require("./rules/compiler");
const target_config_1 = require("./target.config");
const config = general_webpack_config_1.default(entry_1.default(), target_config_1.output, compiler_1.default(), [
    ...js_1.definePlugin(),
    ...js_1.scopeHoisting(),
    ...js_2.HMR(),
    ...js_2.extractVendors(),
    ...js_2.uglify(),
    ...css_1.extractCSS(),
    ...js_2.htmlWebpackPlugin(),
    ...js_2.analyze(),
], "");
exports.default = config;
//# sourceMappingURL=webpack.config.js.map