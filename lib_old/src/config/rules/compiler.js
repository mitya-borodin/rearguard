"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const target_config_1 = require("../target.config");
exports.default = () => {
    const exclude = [/node_modules/, /\.d\.ts$/];
    const include = [target_config_1.context];
    const test = /\.(ts|tsx)?$/;
    return [
        {
            enforce: "pre",
            exclude,
            include,
            loader: "tslint-loader",
            options: {
                configFile: target_config_1.ts.lint,
            },
            test,
        },
        {
            exclude,
            include,
            test,
            use: [
                {
                    loader: "ts-loader",
                    options: {
                        configFile: target_config_1.ts.path,
                    },
                },
            ],
        },
    ];
};
//# sourceMappingURL=compiler.js.map