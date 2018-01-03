"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const target_config_1 = require("../target.config");
exports.HMR = () => {
    if (target_config_1.isDevelopment) {
        return [
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin(),
        ];
    }
    return [];
};
exports.scopeHoisting = () => {
    return [
        new webpack.optimize.ModuleConcatenationPlugin(),
    ];
};
exports.extractVendors = () => ([
    new webpack.optimize.CommonsChunkPlugin({
        minChunks(module) {
            return module.context && module.context.indexOf("node_modules") !== -1;
        },
        name: "vendor",
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: "manifest",
    }),
]);
exports.uglify = () => {
    if (!target_config_1.isDevelopment) {
        return [
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
            }),
        ];
    }
    return [];
};
exports.analyze = () => {
    if (target_config_1.isDebug) {
        return [
            new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
                analyzerPort: target_config_1.analyze.port,
            }),
        ];
    }
    return [];
};
exports.definePlugin = () => ([
    new webpack.DefinePlugin({ "process.env.NODE_ENV": target_config_1.env.NODE_ENV }),
]);
exports.htmlWebpackPlugin = () => {
    return [
        new HtmlWebpackPlugin({
            cache: true,
            filename: "index.html",
            inject: "head",
        }),
    ];
};
//# sourceMappingURL=js.js.map