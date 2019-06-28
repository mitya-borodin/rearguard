import { get_context } from "../../helpers";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";

export function get_stats(envConfig: IEnvConfig): any {
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
