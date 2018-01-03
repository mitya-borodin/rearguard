"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const target_config_1 = require("../config/target.config");
const fs_1 = require("../lib/fs");
function makeServerConfig(output) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield fs_1.writeFile(path.resolve(output, "config.js"), `const proxy = require('http-proxy-middleware');

const config = {
  port: parseInt(process.env.PORT) || ${target_config_1.port},
  proxy: ${JSON.stringify(Object.keys(target_config_1.proxy).map((key) => ({
            route: key,
            target: target_config_1.proxy[key],
        })), null, 2)}
};
const proxies = [];

config.proxy.forEach(({ route, target }) => {
  if (Object.prototype.toString.call(target) === '[object Object]') {
    proxies.push(proxy(route, target));
  }
  if (Object.prototype.toString.call(target) === '[object String]') {
    proxies.push(proxy(route, { target, changeOrigin: true }));
  }
});

module.exports.port = config.port;
module.exports.applyProxies = (app) => proxies.forEach((proxy) => app.use(proxy));
`);
        yield fs_1.writeFile(path.resolve(output, "config.json"), JSON.stringify({
            port: target_config_1.port,
            proxy: Object
                .keys(target_config_1.proxy)
                .map((key) => ({ route: key, target: target_config_1.proxy[key] })),
        }, null, 2));
    });
}
exports.default = makeServerConfig;
//# sourceMappingURL=makeServerConfig.js.map