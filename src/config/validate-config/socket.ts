import chalk from "chalk";
import * as Joi from "joi";
import {ISocket} from "../../interfaces/IConfigs";
import {proxyCheck} from "./proxy";

export const name = "socket";
export const defaultValue: ISocket = {
  analyze: {
    client: 10000,
    server: 10001,
  },
  proxy: {},
  socket: {
    host: "localhost",
    port: "3000",
  },
};
const propType = {
  analyze: Joi.object().keys({
    client: Joi.number().min(4),
    server: Joi.number().min(4),
  }).required(),
  proxy: Joi.object().required(),
  socket: Joi.object().keys({
    host: Joi.string().trim().min(0).required(),
    port: Joi.string().trim().min(4).required(),
  }).required(),
};

export default (socket: any): ISocket => {
  const {error} = Joi.validate(socket, propType);

  if (error !== null) {
    if (process.env.REARGUARD_ERROR_LOG === "true") {
      console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(socket, null, 2)}"`));
      console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
    }

    return defaultValue;
  }
  return {
    ...socket,
    ...proxyCheck({proxy: socket.proxy}, {proxy: {}}),
  };
};
