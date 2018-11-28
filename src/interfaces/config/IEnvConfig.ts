export interface IEnvConfig {
  isInit: boolean;
  isWDS: boolean;
  isTND: boolean;
  isBNS: boolean;
  isBuild: boolean;
  isDebug: boolean;
  force: boolean;
  has_project: boolean;
  has_dll: boolean;
  has_node_lib: boolean;
  has_ui_lib: boolean;
  isDevelopment: boolean;
  localNodeModulePath: string;
  globalNodeModulePath: string;
  devNodeModulePath: string;
  rootDir: string;

  resolveLocalModule(name: string): string;
  resolveGlobalModule(name: string): string;
  resolveDevModule(name: string): string;
}
