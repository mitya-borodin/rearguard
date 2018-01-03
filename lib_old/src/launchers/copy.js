"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const target_config_1 = require("../config/target.config");
const fs_1 = require("../lib/fs");
const makeServerConfig_1 = require("./makeServerConfig");
function copy() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (target_config_1.staticServer) {
            yield fs_1.makeDir(target_config_1.servercOutput);
            yield fs_1.copyFile(path.resolve(__dirname, "./staticServerOrigin.js"), path.resolve(target_config_1.servercOutput, target_config_1.serverEntry));
        }
        if (target_config_1.isIsomorphic || target_config_1.staticServer) {
            const { dependencies: rearguardDep } = require(path.resolve(__dirname, "../../../package.json"));
            yield fs_1.makeDir(target_config_1.servercOutput);
            yield fs_1.copyDir(path.resolve(target_config_1.context, `../${target_config_1.publicDirName}`), path.resolve(target_config_1.servercOutput, target_config_1.publicDirName));
            yield makeServerConfig_1.default(target_config_1.servercOutput);
            yield fs_1.writeFile(path.resolve(target_config_1.servercOutput, "package.json"), JSON.stringify({
                dependencies: Object.assign({}, target_config_1.staticServer
                    ? {}
                    : Object.assign({}, target_config_1.dependencies, { ["source-map-support"]: rearguardDep["source-map-support"] }), { ["http-proxy-middleware"]: rearguardDep["http-proxy-middleware"], ["connect-history-api-fallback"]: rearguardDep["connect-history-api-fallback"], compression: rearguardDep.compression, express: rearguardDep.express }),
                engines: target_config_1.engines,
                private: true,
                scripts: {
                    start: `node ${target_config_1.serverEntry}`,
                },
            }, null, 2));
        }
        else {
            yield fs_1.copyDir(path.resolve(target_config_1.context, `../${target_config_1.publicDirName}`), path.resolve(target_config_1.servercOutput));
        }
    });
}
exports.default = copy;
//# sourceMappingURL=copy.js.map