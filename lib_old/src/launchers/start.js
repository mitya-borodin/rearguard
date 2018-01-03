"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const webpack = require("webpack");
const WDS = require("webpack-dev-server");
const target_config_1 = require("../config/target.config");
const typescript_config_builder_1 = require("../config/typescript.config.builder");
const webpack_config_1 = require("../config/webpack.config");
const typedCSS_1 = require("./typedCSS");
console.log(chalk_1.default.bold.cyan(`=================Start================`));
console.log(chalk_1.default.bold.cyan(`=======Build typescript config========`));
typescript_config_builder_1.default();
console.log(chalk_1.default.bold.cyan(`=========Compile *.css.d.ts===========`));
typedCSS_1.typedCSS(true);
const server = new WDS(webpack(webpack_config_1.default), target_config_1.WDSConfig);
server.listen(target_config_1.socket.port, target_config_1.socket.host, () => {
    console.log(chalk_1.default.bold.cyan(`=================WDS================`));
    console.log(chalk_1.default.bold.cyan(`LAUNCHED: ${target_config_1.socket.host}:${target_config_1.socket.port}`));
    console.log(chalk_1.default.bold.cyan(`===========Watch *.css.d.ts=========`));
    typedCSS_1.typedCSS();
});
//# sourceMappingURL=start.js.map