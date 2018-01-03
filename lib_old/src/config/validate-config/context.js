"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Joi = require("joi");
const common_1 = require("./common");
const defaultValue = {
    context: "src",
};
const propType = {
    context: Joi.string().trim().min(3).required(),
};
exports.default = (fileName) => {
    const { exist, value: context } = common_1.default(fileName, "context");
    if (exist) {
        const { error } = Joi.validate(context, propType);
        if (error !== null) {
            console.log(chalk_1.default.bold.yellow(`Current value: "${JSON.stringify(context, null, 2)}"`));
            console.log(chalk_1.default.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
            return defaultValue;
        }
        return context;
    }
    else {
        return defaultValue;
    }
};
//# sourceMappingURL=context.js.map