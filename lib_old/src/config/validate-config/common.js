"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
exports.default = (fileName, fieldName) => {
    const configPath = path.resolve(process.cwd(), fileName);
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, { encoding: "utf8" }));
        return {
            exist: true,
            value: {
                [fieldName]: config[fieldName],
            },
        };
    }
    return {
        exist: false,
        value: {},
    };
};
//# sourceMappingURL=common.js.map