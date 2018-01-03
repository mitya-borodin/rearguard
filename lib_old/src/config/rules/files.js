"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const target_config_1 = require("../target.config");
exports.file = () => ({
    loader: "file-loader",
    query: {
        name: target_config_1.isDevelopment ? "[path][name].[ext]?[hash:8]" : "[hash:32].[ext]",
    },
    test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
});
//# sourceMappingURL=files.js.map