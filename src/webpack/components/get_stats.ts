import { get_context } from "../../helpers";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import webpack = require("webpack");

export function get_stats(envConfig: IEnvConfig): webpack.Stats | string {
  return envConfig.isDebug
    ? "verbose"
    : {
        assets: false,
        colors: true,
        context: get_context(),
        hash: true,
        modules: false,
        performance: false,
        publicPath: true,
        timings: true,
        version: true,
      };
}
