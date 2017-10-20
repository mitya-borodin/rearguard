import chalk from "chalk";
import * as Joi from "joi";
import { IEntry } from "../../interfaces/IConfigs";
import detectConfig from "./common";

const defaultValue: IEntry = {
  entry: "main.js",
};
const propType = {
  entry: Joi.string().trim().min(6).required(),
};

export default (fileName: string): IEntry => {
  const { exist, value: entry } = detectConfig(fileName, "entry");

  if (exist) {

    const { error } = Joi.validate(entry, propType);

    if (error !== null) {
      if (process.env.REARGUARD_ERROR_LOG === "true") {
        console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(entry, null, 2)}"`));
        console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
      }

      return defaultValue;
    }
    return entry;
  } else {
    return defaultValue;
  }
};
