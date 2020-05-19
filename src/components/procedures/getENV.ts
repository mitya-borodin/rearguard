import path from "path";
import webpack from "webpack";

export const getENV = (CWD: string): { [key: string]: webpack.DefinePlugin.CodeValueObject } => {
  try {
    const { parsed = {} } = require("dotenv").config({
      path: path.resolve(CWD, ".env"),
      debug: process.env.DEBUG,
    });

    return {
      ...parsed,
      ...Object.keys(parsed).reduce((env, key) => {
        env[`process.env.${key}`] = JSON.stringify(parsed[key]);

        return env;
      }, {}),
    };
  } catch (error) {
    console.error(error);
  }

  return {
    interpolationHTML: {},
    definePlugin: {},
  };
};
