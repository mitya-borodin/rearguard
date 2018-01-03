"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack = require("webpack");
const target_config_1 = require("../config/target.config");
const webpack_config_1 = require("../config/webpack.config");
function bundle() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve, reject) => {
            webpack(webpack_config_1.default).run((err, stats) => {
                if (err) {
                    return reject(err);
                }
                console.info(stats.toString(target_config_1.stats));
                return resolve();
            });
        });
    });
}
exports.default = bundle;
//# sourceMappingURL=bundle.js.map