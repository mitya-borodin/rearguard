import path from "path";

export const getENV = (CWD: string): { interpolationHTML: object; definePlugin: object } => {
  try {
    const { parsed = {} } = require("dotenv").config({
      path: path.resolve(CWD, ".env"),
      debug: process.env.DEBUG,
    });

    return {
      interpolationHTML: parsed,
      definePlugin: Object.keys(parsed).reduce((env, key) => {
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