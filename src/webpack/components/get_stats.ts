import { envConfig } from "../../config/env";
import { rearguardConfig } from "../../config/rearguard";
import { get_context } from "../../helpers";

export function get_stats(): any {
  return envConfig.isDebug
    ? "verbose"
    : {
        assets: true,
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
