"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Joi = require("joi");
const common_1 = require("./common");
const defaultValue = {
    postCSS: {
        plugins: "postCssPlugins.js",
    },
};
const propType = {
    postCSS: Joi.object().keys({ plugins: Joi.string().required() }).required(),
};
exports.default = (fileName) => {
    const { exist, value: css } = common_1.default(fileName, "css");
    if (exist) {
        const { error } = Joi.validate(css, propType);
        if (error !== null) {
            if (process.env.REARGUARD_ERROR_LOG === "true") {
                console.log(chalk_1.default.bold.yellow(`Current value: "${JSON.stringify(css, null, 2)}"`));
                console.log(chalk_1.default.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
            }
            return defaultValue;
        }
        return css;
    }
    else {
        return defaultValue;
    }
};
//# sourceMappingURL=css.js.map