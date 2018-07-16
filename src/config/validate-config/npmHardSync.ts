import chalk from "chalk";
import * as Joi from "joi";
import { INpmHardSync } from "../../interfaces/IConfigs";
import detectConfig from "./common";

const defaultValue: INpmHardSync = {
  npmHardSync: [],
};
const propType = {
  npmHardSync: Joi.array()
    .items(Joi.string())
    .required(),
};

export default (fileName: string): INpmHardSync => {
  const { exist, value: output } = detectConfig(fileName, "npmHardSync");

  if (exist) {
    const { error } = Joi.validate(output, propType);

    if (error !== null) {
      console.log(
        chalk.bold.yellow(
          `Current value: "${JSON.stringify(output, null, 2)}"`,
        ),
      );
      console.log(
        chalk.bold.cyan(
          `We are using: "${JSON.stringify(defaultValue, null, 2)}"`,
        ),
      );

      return defaultValue;
    }
    return output;
  } else {
    return defaultValue;
  }
};
