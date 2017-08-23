import * as chalk from "chalk";
import * as Joi from "joi";
import { ISocket } from "../../interfaces/IConfigs";

export const name = "socket";

export const defaultValue: ISocket = {
  socket: {
    port: "3000",
    host: "localhost",
  },
};
const propType = {
  socket: Joi.object().keys({
    port: Joi.string().trim().min(4).required(),
    host: Joi.string().trim().min(0).required(),
  }).required(),
};

export default (socket: any): ISocket => {
  const { error } = Joi.validate(socket, propType);

  if (error !== null) {
    if (process.env.REARGUARD_ERROR_LOG === "true") {
      console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(socket, null, 2)}"`));
      console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
    }

    return defaultValue;
  }
  return socket;
};
