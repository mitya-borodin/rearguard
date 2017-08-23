import * as chalk from "chalk";
import * as Joi from "joi";
import { ITypescript } from "../../interfaces/IConfigs";
import detectConfig from "./common";

const defaultValue: ITypescript = {
  typescript: {
    configPath: "tsconfig.json",
    showConfigForIDE: true,
    config: {
      compilerOptions: {},
      compileOnSave: false,
    },
  },
};

const propType = {
  typescript: Joi.object().keys({
    configPath: Joi.string().trim().min(0).required(),
    showConfigForIDE: Joi.boolean().required(),
    config: Joi.object().keys({
      compilerOptions: Joi.object(),
      compileOnSave: Joi.boolean(),
    }),
  }).required(),
};

export default (fileName: string): ITypescript => {
  const { exist, value: typescript } = detectConfig(fileName, "typescript");

  if (exist) {
    const { error } = Joi.validate(typescript, propType);

    if (error !== null) {
      if (process.env.REARGUARD_ERROR_LOG === "true") {
        console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(typescript, null, 2)}"`));
        console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
      }

      return defaultValue;
    }

    return typescript;
  } else {
    return defaultValue;
  }
};
