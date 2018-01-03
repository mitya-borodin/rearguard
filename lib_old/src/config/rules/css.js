"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const target_config_1 = require("../target.config");
const use = (isExternal = false, isModules = false) => ([
    ...target_config_1.isDevelopment ? [{ loader: "style-loader" }] : [],
    {
        loader: "css-loader",
        options: {
            discardComments: {
                removeAll: true,
            },
            importLoaders: !isExternal ? 1 : 0,
            localIdentName: target_config_1.isDevelopment ? "[path][local]" : "[hash:base64:32]",
            minimize: !target_config_1.isDevelopment,
            modules: isModules,
            sourceMap: target_config_1.isDevelopment,
        },
    },
    ...!isExternal ? [{ loader: "postcss-loader", options: { plugins: target_config_1.postCSS.config } }] : [],
]);
const rules = (isExternal = false, isModules = true) => {
    if (target_config_1.isDevelopment) {
        return {
            use: use(isExternal, isModules),
        };
    }
    return {
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            publicPath: target_config_1.output.publicPath,
            use: use(isExternal, isModules),
        }),
    };
};
exports.default = () => ([
    Object.assign({ exclude: [/\.global\.css/], include: target_config_1.context, test: /\.css/ }, rules()),
    Object.assign({ exclude: [target_config_1.context, /\.global\.css/], test: /\.css/ }, rules(true, false)),
    Object.assign({ include: target_config_1.context, test: /\.global\.css/ }, rules(true, false)),
]);
//# sourceMappingURL=css.js.map