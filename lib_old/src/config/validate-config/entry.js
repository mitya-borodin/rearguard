"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Joi = require("joi");
const common_1 = require("./common");
const defaultValue = {
    entry: "index.tsx",
};
const propType = {
    entry: Joi.string().trim().min(9).required(),
};
exports.default = (fileName) => {
    const { exist, value: entry } = common_1.default(fileName, "entry");
    if (exist) {
        const { error } = Joi.validate(entry, propType);
        if (error !== null) {
            console.log(chalk_1.default.bold.yellow(`Current value: "${JSON.stringify(entry, null, 2)}"`));
            console.log(chalk_1.default.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
            return defaultValue;
        }
        return entry;
    }
    else {
        return defaultValue;
    }
};
//# sourceMappingURL=entry.js.map