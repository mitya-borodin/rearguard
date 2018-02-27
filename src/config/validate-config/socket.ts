import chalk from "chalk";
import * as Joi from "joi";
import {ISocket} from "../../interfaces/IConfigs";
import {proxyCheck} from "./proxy";

export const name = "socket";
export const defaultValue: ISocket = {
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
    .keys(
      {
        port: Joi.number().min(4).required(),
      },
    )
    .required(),
  proxy: Joi.object().required(),
  socket: Joi.object()
    .keys(
      {
        host: Joi.string().trim().min(0).required(),
        port: Joi.number().min(4).required(),
      },
    )
    .required(),
};

export default (socket: any): ISocket => {
  const {error} = Joi.validate(socket, propType);

  if (error !== null) {
    console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(socket, null, 2)}"`));
    console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));

    return defaultValue;
  }

  return {
    ...socket,
    ...proxyCheck({proxy: socket.proxy}, {proxy: {}}),
  };
};
