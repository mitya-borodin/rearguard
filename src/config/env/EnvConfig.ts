import { IEnvConfig } from "../../interfaces/IEnvConfig";

export class EnvConfig implements IEnvConfig {
  get isWDS(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_WDS === "true";
  }

  get isBuild(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_BUILD === "true";
  }

  get isDebug(): boolean {
    return process.env.REARGUARD_DEBUG === "true";
  }

  get has_dll(): boolean {
    return process.env.REARGUARD_DLL === "true";
  }

  get has_node_lib(): boolean {
    return process.env.REARGUARD_NODE_LIB === "true";
  }

  get has_ui_lib(): boolean {
    return process.env.REARGUARD_UI_LIB === "true";
  }

  get isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  }

  get isSyncDeps(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_SYNC_DEPS === "true";
  }

  get nodeModulePath(): string {
    return process.env.REARGUARD_NODE_MODULE_PATH || "";
  }

  get localNodeModulePath(): string {
    return process.env.REARGUARD_LOCAL_NODE_MODULE_PATH || "";
  }
}
