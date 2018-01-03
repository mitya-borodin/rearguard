"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Joi = require("joi");
const common_1 = require("./common");
const defaultValue = {
    output: {
        path: "dist",
        publicPath: "/",
    },
};
const propType = {
    output: Joi.object()
        .keys({
        path: Joi.string().trim().min(0).required(),
        publicPath: Joi.string().trim().min(0).required(),
    })
        .required(),
};
exports.default = (fileName) => {
    const { exist, value: output } = common_1.default(fileName, "output");
    if (exist) {
        const { error } = Joi.validate(output, propType);
        if (error !== null) {
            console.log(chalk_1.default.bold.yellow(`Current value: "${JSON.stringify(output, null, 2)}"`));
            console.log(chalk_1.default.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
            return defaultValue;
        }
        return output;
    }
    else {
        return defaultValue;
    }
};
//# sourceMappingURL=output.js.map