"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Joi = require("joi");
const common_1 = require("./common");
const defaultValue = {
    typescript: {
        config: {
            compileOnSave: false,
            compilerOptions: {},
        },
        configPath: "tsconfig.json",
        showConfigForIDE: true,
    },
};
const propType = {
    typescript: Joi.object().keys({
        config: Joi.object().keys({
            compileOnSave: Joi.boolean(),
            compilerOptions: Joi.object(),
        }),
        configPath: Joi.string().trim().min(0).required(),
        showConfigForIDE: Joi.boolean().required(),
    }).required(),
};
exports.default = (fileName) => {
    const { exist, value: typescript } = common_1.default(fileName, "typescript");
    if (exist) {
        const { error } = Joi.validate(typescript, propType);
        if (error !== null) {
            console.log(chalk_1.default.bold.yellow(`Current value: "${JSON.stringify(typescript, null, 2)}"`));
            console.log(chalk_1.default.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
            return defaultValue;
        }
        return typescript;
    }
    else {
        return defaultValue;
    }
};
//# sourceMappingURL=typescript.js.map