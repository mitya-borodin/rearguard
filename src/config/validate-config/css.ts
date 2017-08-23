import * as chalk from "chalk";
import * as Joi from "joi";
import { ICSS } from "../../interfaces/IConfigs";
import detectConfig from "./common";

const defaultValue: ICSS = {
  css: {
    isolation: true,
    reset: {
      "all": "initial",
      "display": "block",
      "boxSizing": "border-box",
      "font-family": "Avenir Next, -apple-system, BlinkMacSystemFonts, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
      "font-size": "inherit",
    },
    postCssPlugins: "postCssPlugins.js",
  },
};

const propType = {
  css: Joi.object()
    .keys({
      isolation: Joi.boolean()
        .required(),
      reset: Joi.object()
        .required(),
      postCssPlugins: Joi.string()
        .required(),
    })
    .required(),
};

export default (fileName: string): ICSS => {
  const { exist, value: css } = detectConfig(fileName, "css");

  if (exist) {
    const { error } = Joi.validate(css, propType);

    if (error !== null) {
      if (process.env.REARGUARD_ERROR_LOG === "true") {
        console.log(chalk.bold.yellow(`Current value: "${JSON.stringify(css, null, 2)}"`));
        console.log(chalk.bold.cyan(`We are using: "${JSON.stringify(defaultValue, null, 2)}"`));
      }

      return defaultValue;
    }

    return css;
  } else {
    return defaultValue;
  }
};
