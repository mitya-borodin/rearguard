"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Joi = require("joi");
const proxy_1 = require("./proxy");
exports.name = "socket";
exports.defaultValue = {
    analyze: {
        port: 10000,
    },
    proxy: {},
    socket: {
        host: "localhost",
        port: 3000,
    },
};
const propType = {
    analyze: Joi.object()
        .keys({
        client: Joi.number().min(4),
        server: Joi.number().min(4),
    })
        .required(),
    proxy: Joi.object().required(),
    socket: Joi.object()
        .keys({
        host: Joi.string().trim().min(0).required(),
        port: Joi.string().trim().min(4).required(),
    })
        .required(),
};
exports.default = (socket) => {
    const { error } = Joi.validate(socket, propType);
    if (error !== null) {
        console.log(chalk_1.default.bold.yellow(`Current value: "${JSON.stringify(socket, null, 2)}"`));
        console.log(chalk_1.default.bold.cyan(`We are using: "${JSON.stringify(exports.defaultValue, null, 2)}"`));
        return exports.defaultValue;
    }
    return Object.assign({}, socket, proxy_1.proxyCheck({ proxy: socket.proxy }, { proxy: {} }));
};
//# sourceMappingURL=socket.js.map