import chalk from "chalk";
import * as Joi from "joi";
import { IBrowserslist } from "../../interfaces/IConfigs";
import detectConfig from "./common";

const defaultValue: IBrowserslist = {
  browserslist: [
    ">0.1%",
    "last 2 versions",
    "not ie <= 11",
  ],
};

const propType = {
  browserslist: Joi.array().items(Joi.string()).min(1).required(),
};

export default (fileName: string): IBrowserslist => {
  const { exist, value: browserslist } = detectConfig(fileName, "browserslist");

  if (exist) {
    const { error } = Joi.validate(browserslist, propType);

    if (error !== null) {
      if (process.env.REARGUARD_ERROR_LOG === "true") {
        console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(browserslist, null, 2)}"`));
        console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
      }

      return defaultValue;
    }

    return browserslist;
  } else {
    return defaultValue;
  }
};
