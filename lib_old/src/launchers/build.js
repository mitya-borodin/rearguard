"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const webpack = require("webpack");
const target_config_1 = require("../config/target.config");
const webpack_config_1 = require("../config/webpack.config");
console.log(chalk_1.default.bold.cyan(`=================Build================`));
webpack(webpack_config_1.default).run((err, stats) => {
    if (err) {
        throw new Error(err);
    }
    console.info(stats.toString(target_config_1.stats));
    console.log(chalk_1.default.bold.cyan(`=============Build End================`));
});
//# sourceMappingURL=build.js.map