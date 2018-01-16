import chalk from "chalk";
import * as Joi from "joi";
import { IModules } from "../../interfaces/IConfigs";
import detectConfig from "./common";

const defaultValue: IModules = {
  modules: [
    "src",
  ],
};
const propType = {
  modules: Joi.array()
              .items(Joi.string().trim().min(3).required())
              .min(1).required(),
};

export default (fileName: string): IModules => {
  const { exist, value: modules } = detectConfig(fileName, "modules");

  if (exist) {
    const { error } = Joi.validate(modules, propType);

    if (error !== null) {
      console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(modules, null, 2)}"`));
      console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));

      return defaultValue;
    }

    return modules;
  } else {
    return defaultValue;
  }
};
