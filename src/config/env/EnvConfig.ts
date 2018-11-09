export class EnvConfig {
  get isWDS(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_WDS === "true";
  }

  get isBuild(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_BUILD === "true";
  }

  get isLib(): boolean {
    return process.env.REARGUARD_LIB === "true";
  }

  get isDll(): boolean {
    return process.env.REARGUARD_DLL === "true";
  }

  get isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  }

  get isSyncDeps(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_SYNC_DEPS === "true";
  }

  get isDebug(): boolean {
    return process.env.REARGUARD_DEBUG === "true";
  }

  get nodeModulePath(): string {
    return process.env.REARGUARD_NODE_MODULE_PATH || "";
  }

  get localNodeModulePath(): string {
    return process.env.REARGUARD_LOCAL_NODE_MODULE_PATH || "";
  }
}
