import * as path from "path";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";

export class EnvConfig implements IEnvConfig {
  constructor() {
    this.resolveLocalModule = this.resolveLocalModule.bind(this);
    this.resolveGlobalModule = this.resolveGlobalModule.bind(this);
    this.resolveDevModule = this.resolveDevModule.bind(this);
  }

  get isInit(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_INIT === "true";
  }

  get isWDS(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_WDS === "true";
  }

  get isSync(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_SYNC === "true";
  }

  get isBNS(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_BUILD_NODE_SERVER === "true";
  }

  get isBuild(): boolean {
    return process.env.REARGUARD_LAUNCH_IS_BUILD === "true";
  }

  get isDebug(): boolean {
    return process.env.REARGUARD_DEBUG === "true";
  }

  get isWatch(): boolean {
    return process.env.REARGUARD_WATCH === "true";
  }

  get force(): boolean {
    return process.env.REARGUARD_FORCE === "true";
  }

  get install_deps(): boolean {
    return process.env.REARGUARD_INSTALL_DEPS === "true";
  }
  get is_application(): boolean {
    return process.env.REARGUARD_IS_APPLICATION === "true";
  }

  get has_dll(): boolean {
    return process.env.REARGUARD_DLL === "true";
  }

  get has_node_lib(): boolean {
    return process.env.REARGUARD_NODE_LIB === "true";
  }

  get has_browser_lib(): boolean {
    return process.env.REARGUARD_BROWSER_LIB === "true";
  }

  get load_on_demand(): boolean {
    return process.env.REARGUARD_LOAD_ON_DEMAND === "true";
  }

  get isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  }

  get isBuildBoth(): boolean {
    return process.env.REARGUARD_BUILD_BOTH === "true";
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

  /**
   * MONO_REPOSITORY
   */

  get is_mono_init(): boolean {
    return process.env.REARGUARD_MONO_INIT === "true";
  }

  get is_mono_clear(): boolean {
    return process.env.REARGUARD_MONO_CLEAR === "true";
  }

  get is_mono_install(): boolean {
    return process.env.REARGUARD_MONO_INSTALL === "true";
  }

  get is_mono_build(): boolean {
    return process.env.REARGUARD_MONO_BUILD === "true";
  }

  get is_mono_link(): boolean {
    return process.env.REARGUARD_MONO_LINK === "true";
  }

  get is_mono_bootstrap(): boolean {
    return process.env.REARGUARD_MONO_BOOTSTRAP === "true";
  }

  get is_mono_test(): boolean {
    return process.env.REARGUARD_MONO_TEST === "true";
  }

  get is_mono_publish(): boolean {
    return process.env.REARGUARD_MONO_PUBLISH === "true";
  }

  get is_mono_publish_patch(): boolean {
    return process.env.REARGUARD_MONO_PUBLISH_PATH === "true";
  }

  get is_mono_publish_minor(): boolean {
    return process.env.REARGUARD_MONO_PUBLISH_MINOR === "true";
  }

  get is_mono_publish_major(): boolean {
    return process.env.REARGUARD_MONO_PUBLISH_MAJOR === "true";
  }

  /**
   * END
   */

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
