import * as chalk from "chalk";
import * as Joi from "joi";
import { IIsomorphic } from "../../interfaces/IConfigs";
import detectConfig from "./common";

const defaultValue: IIsomorphic = {
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

export default (fileName: string): IIsomorphic => {
  const { exist, value: isomorphic } = detectConfig(fileName, "isomorphic");

  if (exist) {

    const { error } = Joi.validate(isomorphic, propType);

    if (error !== null) {
      if (process.env.REARGUARD_ERROR_LOG === "true") {
        console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(isomorphic, null, 2)}"`));
        console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
      }
      return defaultValue;
    }
    return isomorphic;
  } else {

    return defaultValue;
  }
};
