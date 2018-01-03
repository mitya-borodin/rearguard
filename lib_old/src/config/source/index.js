"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const build_config_1 = require("./build.config");
const env_config_1 = require("./env.config");
const pkg_info_1 = require("./pkg.info");
const socket_config_1 = require("./socket.config");
exports.default = () => {
    const _a = build_config_1.default(), { proxy: versifying } = _a, buildConfig = tslib_1.__rest(_a, ["proxy"]);
    const _b = socket_config_1.default(), { proxy: unVersifying } = _b, socketConfig = tslib_1.__rest(_b, ["proxy"]);
    return Object.assign({}, buildConfig, socketConfig, { proxy: Object.assign({}, versifying, unVersifying) }, env_config_1.default(), pkg_info_1.default());
};
//# sourceMappingURL=index.js.map