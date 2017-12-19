import { IEnv } from "../../interfaces/IConfigs";

export default (): IEnv => ({
  isAnalyze: process.env.REARGUARD_ANALYZE === "true",
  isBuild:  process.env.REARGUARD_LAUNCH_IS_BUILD === "true",
  isDebug: process.env.REARGUARD_DEBUG === "true",
  isDevelopment: process.env.NODE_ENV === "development",
  isIsomorphic: process.env.REARGUARD_ISOMORPHIC === "true",
  isSourceMap: process.env.REARGUARD_SOURCE_MAP === "true",
  isStart: process.env.REARGUARD_LAUNCH_IS_START === "true",
  isVerbose: process.env.REARGUARD_VERBOSE === "true",
  nodeModulePath: process.env.REARGUARD_NODE_MODULE_PATH || "",
  onlyServer: process.env.REARGUARD_ONLY_SERVER === "true",
  staticServer: process.env.REARGUARD_STATIC_SERVER === "true",
});
