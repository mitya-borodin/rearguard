"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const target_config_1 = require("../target.config");
exports.extractCSS = () => {
    if (!target_config_1.isDevelopment) {
        return [
            new ExtractTextPlugin({ filename: "[name].[hash].css" }),
        ];
    }
    return [];
};
//# sourceMappingURL=css.js.map