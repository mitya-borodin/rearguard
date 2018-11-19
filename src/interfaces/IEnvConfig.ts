export interface IEnvConfig {
  isWDS: boolean;
  isBuild: boolean;
  isDebug: boolean;
  has_dll: boolean;
  has_node_lib: boolean;
  has_ui_lib: boolean;
  isDevelopment: boolean;
  isSyncDeps: boolean;
  nodeModulePath: string;
  localNodeModulePath: string;
}
