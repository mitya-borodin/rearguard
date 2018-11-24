import { envConfig } from "../../config/env";
import { rearguardConfig } from "../../config/rearguard";

export function get_stats(): "verbose" | "normal" {
  return envConfig.isDebug ? "verbose" : "normal";
}
