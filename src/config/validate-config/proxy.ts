import chalk from "chalk";
import * as Joi from "joi";
import { IProxy } from "../../interfaces/IConfigs";
import detectConfig from "./common";

const defaultValue: IProxy = {
  proxy: {
    "/api": "http://localhost:5000",
    "/ws": {
      changeOrigin: true,
      target: "http://localhost:5000",
      ws: true,
    },
  },
};

export const proxyCheck = (
  { proxy }: IProxy,
  { proxy: DEFAULT_VALUE }: IProxy,
): IProxy => {
  let wasError = false;

  for (const proxyName in proxy) {
    if (proxy.hasOwnProperty(proxyName)) {
      const { error: proxyNameError } = Joi.validate(
        proxyName,
        Joi.string()
          .trim()
          .required(),
      );
      let proxyValueError = null;

      if (
        Object.prototype.toString.call(proxy[proxyName]) === "[object Object]"
      ) {
        proxyValueError = Joi.validate(
          proxy[proxyName],
          Joi.object().keys({
            changeOrigin: Joi.boolean(),
            logLevel: Joi.string(),
            target: Joi.string()
              .required()
              .min(10, "utf-8"),
            ws: Joi.boolean(),
          }),
        ).error;
      } else {
        proxyValueError = Joi.validate(
          proxy[proxyName],
          Joi.string()
            .trim()
            .min(6)
            .required(),
        ).error;
      }

      if (proxyNameError !== null) {
        console.error(proxyNameError.message);
      }
      if (proxyValueError !== null) {
        console.error(proxyValueError.message);
      }

      if (proxyNameError !== null || proxyValueError !== null) {
        wasError = true;

        console.log(
          chalk.bold.yellow(
            `Current value: "${JSON.stringify(proxy, null, 2)}"`,
          ),
        );
        console.log(
          chalk.bold.cyan(
            `We are using: "${JSON.stringify(DEFAULT_VALUE, null, 2)}"`,
          ),
        );
      }
    }
  }

  if (wasError) {
    return { proxy: DEFAULT_VALUE };
  }

  return { proxy };
};

export default (fileName: string): IProxy => {
  const {
    exist,
    value: { proxy },
  } = detectConfig(fileName, "proxy");

  if (exist) {
    return proxyCheck({ proxy }, defaultValue);
  } else {
    return defaultValue;
  }
};
