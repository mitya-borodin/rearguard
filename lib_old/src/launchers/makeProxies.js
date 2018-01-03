"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy = require("http-proxy-middleware");
const target_config_1 = require("../config/target.config");
const proxies = [];
exports.default = () => {
    if (proxies.length > 0) {
        return proxies;
    }
    Object.keys(target_config_1.proxy).forEach((route) => {
        if (Object.prototype.toString.call(target_config_1.proxy[route]) === "[object Object]") {
            proxies.push(proxy(route, target_config_1.proxy[route]));
        }
        if (Object.prototype.toString.call(target_config_1.proxy[route]) === "[object String]") {
            proxies.push(proxy(route, { target: target_config_1.proxy[route], changeOrigin: true }));
        }
    });
    return proxies;
};
//# sourceMappingURL=makeProxies.js.map