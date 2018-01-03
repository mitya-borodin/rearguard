"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Joi = require("joi");
const common_1 = require("./common");
const defaultValue = {
    browserslist: [
        ">0.1%",
        "last 2 versions",
        "not ie <= 11",
    ],
};
const propType = {
    browserslist: Joi.array().items(Joi.string()).min(1).required(),
};
exports.default = (fileName) => {
    const { exist, value: browserslist } = common_1.default(fileName, "browserslist");
    if (exist) {
        const { error } = Joi.validate(browserslist, propType);
        if (error !== null) {
            if (process.env.REARGUARD_ERROR_LOG === "true") {
                console.log(chalk_1.default.bold.yellow(`Current value: "${JSON.stringify(browserslist, null, 2)}"`));
                console.log(chalk_1.default.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
            }
            return defaultValue;
        }
        return browserslist;
    }
    else {
        return defaultValue;
    }
};
//# sourceMappingURL=browserslist.js.map