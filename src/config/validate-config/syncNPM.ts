import chalk from "chalk";
import * as Joi from "joi";
import { ISyncNPM } from "../../interfaces/IConfigs";
import detectConfig from "./common";

const defaultValue: ISyncNPM = {
  syncNPM: [],
};
const propType = {
  syncNPM: Joi.array()
    .items(Joi.string())
    .required(),
};

export default (fileName: string): ISyncNPM => {
  const { exist, value: output } = detectConfig(fileName, "syncNPM");

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
