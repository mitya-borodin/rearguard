import { IEnv } from "../../interfaces/IConfigs";

export default (): IEnv => ({
  isBuild:  process.env.REARGUARD_LAUNCH_IS_BUILD === "true",
  isDebug: process.env.REARGUARD_DEBUG === "true",
  isDevelopment: process.env.NODE_ENV === "development",
  isStart: process.env.REARGUARD_LAUNCH_IS_START === "true",
  nodeModulePath: process.env.REARGUARD_NODE_MODULE_PATH || "",
});
