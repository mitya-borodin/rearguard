import { IEnv } from "../../interfaces/IConfigs";

export default (): IEnv => ({
  isAnalyze: process.env.REARGUARD_ANALYZE === "true",
  isDebug: process.env.REARGUARD_DEBUG === "true",
  isDevelopment: process.env.NODE_ENV === "development",
  isInferno: process.env.REARGUARD_INFERNO_JS === "true",
  isIsomorphic: process.env.REARGUARD_ISOMORPHIC === "true",
  isReact: process.env.REARGUARD_REACT === "true",
  isTS: process.env.REARGUARD_TYPE_SCRIPT === "true",
  isVerbose: process.env.REARGUARD_VERBOSE === "true",
  nodeModulePath: process.env.REARGUARD_NODE_MODULE_PATH || "",
  onlyServer: process.env.REARGUARD_ONLY_SERVER === "true",
});
