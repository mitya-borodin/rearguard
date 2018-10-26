import { IEnv } from "../../interfaces/IConfigs";

export default (): IEnv => ({
  isWDS: process.env.REARGUARD_LAUNCH_IS_WDS === "true",
  // tslint:disable-next-line:object-literal-sort-keys
  isSyncDeps: process.env.REARGUARD_LAUNCH_IS_SYNC_DEPS === "true",
  isBuild: process.env.REARGUARD_LAUNCH_IS_BUILD === "true",
  isDevelopment: process.env.NODE_ENV === "development",
  isDebug: process.env.REARGUARD_DEBUG === "true",
  isLib: process.env.REARGUARD_LIB === "true",
  isDll: process.env.REARGUARD_DLL === "true",
  nodeModulePath: process.env.REARGUARD_NODE_MODULE_PATH || "",
  localNodeModulePath: process.env.REARGUARD_LOCAL_NODE_MODULE_PATH || "",
});
