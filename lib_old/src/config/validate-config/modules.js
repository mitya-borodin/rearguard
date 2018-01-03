"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Joi = require("joi");
const common_1 = require("./common");
const defaultValue = {
    modules: [
        "src",
    ],
};
const propType = {
    modules: Joi.array()
        .items(Joi.string().trim().min(3).required())
        .min(1).required(),
};
exports.default = (fileName) => {
    const { exist, value: modules } = common_1.default(fileName, "modules");
    if (exist) {
        const { error } = Joi.validate(modules, propType);
        if (error !== null) {
            console.log(chalk_1.default.bold.yellow(`Current value: "${JSON.stringify(modules, null, 2)}"`));
            console.log(chalk_1.default.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
            return defaultValue;
        }
        return modules;
    }
    else {
        return defaultValue;
    }
};
//# sourceMappingURL=modules.js.map