import chalk from "chalk";
import * as Joi from "joi";
import { ILibEntry } from "../../interfaces/IConfigs";
import detectConfig from "./common";

const defaultValue = { lib_entry: "lib_exports.ts" };

const propType = {
  lib_entry: Joi.string()
    .trim()
    .min(3)
    .required(),
};

export default (fileName: string): ILibEntry => {
  // tslint:disable-next-line:variable-name
  const { exist, value } = detectConfig(fileName, "lib_entry");

  if (exist) {
    const { error } = Joi.validate(value, propType);

    if (error !== null) {
      console.log(
        chalk.bold.yellow(`Current value: "${JSON.stringify(value, null, 2)}"`),
      );
      console.log(
        chalk.bold.cyan(
          `We are using: "${JSON.stringify(defaultValue, null, 2)}"`,
        ),
      );

      return defaultValue;
    }

    return value;
  } else {
    return defaultValue;
  }
};
