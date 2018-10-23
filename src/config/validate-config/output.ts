import chalk from "chalk";
import * as Joi from "joi";
import { IOutput } from "../../interfaces/IConfigs";
import detectConfig from "./common";

const defaultValue: IOutput = {
  output: {
    path: "dist",
    publicPath: "/",
  },
};
const propType = {
  output: Joi.object()
    .keys({
      path: Joi.string()
        .trim()
        .min(0)
        .required(),
      publicPath: Joi.string()
        .trim()
        .min(0)
        .required(),
    })
    .required(),
};

export default (fileName: string): IOutput => {
  const { exist, value: output } = detectConfig(fileName, "output");

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
