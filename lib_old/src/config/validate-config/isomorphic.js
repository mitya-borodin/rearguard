"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Joi = require("joi");
const common_1 = require("./common");
const defaultValue = {
    isomorphic: {
        entry: "server.js",
        publicDirName: "public",
    },
};
const propType = {
    isomorphic: Joi.object().keys({
        entry: Joi.string().trim().min(0).required(),
        publicDirName: Joi.string().trim().min(0).required(),
    }).required(),
};
exports.default = (fileName) => {
    const { exist, value: isomorphic } = common_1.default(fileName, "isomorphic");
    if (exist) {
        const { error } = Joi.validate(isomorphic, propType);
        if (error !== null) {
            if (process.env.REARGUARD_ERROR_LOG === "true") {
                console.log(chalk_1.default.bold.yellow(`Current value: "${JSON.stringify(isomorphic, null, 2)}"`));
                console.log(chalk_1.default.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
            }
            return defaultValue;
        }
        return isomorphic;
    }
    else {
        return defaultValue;
    }
};
//# sourceMappingURL=isomorphic.js.map