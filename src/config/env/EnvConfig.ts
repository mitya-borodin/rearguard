import * as path from "path";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";

export class EnvConfig implements IEnvConfig {
  constructor() {
    this.resolveLocalModule = this.resolveLocalModule.bind(this);
    this.resolveGlobalModule = this.resolveGlobalModule.bind(this);
    this.resolveDevModule = this.resolveDevModule.bind(this);
  }

  get isWDS(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_WDS === "true";
  }

  get isBuild(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_BUILD === "true";
  }

  get isDebug(): boolean {
    return process.env.REARGUARD_DEBUG === "true";
  }

  get force(): boolean {
    return process.env.REARGUARD_FORCE === "true";
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

  get localNodeModulePath(): string {
    return process.env.REARGUARD_LOCAL_NODE_MODULE_PATH || "";
  }

  get globalNodeModulePath(): string {
    return process.env.REARGUARD_GLOBAL_NODE_MODULES_PATH || "";
  }

  get devNodeModulePath(): string {
    return process.env.REARGUARD_DEV_NODE_MODULE_PATH || "";
  }

  get rootDir(): string {
    return process.cwd();
  }

  public resolveLocalModule(name: string): string {
    return path.resolve(this.localNodeModulePath, name);
  }

  public resolveGlobalModule(name: string): string {
    return path.resolve(this.globalNodeModulePath, name);
  }

  public resolveDevModule(name: string): string {
    return path.resolve(this.devNodeModulePath, name);
  }
}
