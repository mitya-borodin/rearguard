export interface IEnvConfig {
  isInit: boolean;
  isWDS: boolean;
  isSync: boolean;
  isBNS: boolean;
  isBuild: boolean;
  isDebug: boolean;
  isWatch: boolean;
  force: boolean;
  install_deps: boolean;
  is_application: boolean;
  has_dll: boolean;
  has_node_lib: boolean;
  has_browser_lib: boolean;
  load_on_demand: boolean;
  isDevelopment: boolean;
  isBuildBoth: boolean;
  localNodeModulePath: string;
  globalNodeModulePath: string;
  devNodeModulePath: string;
  rootDir: string;

  is_mono_init: boolean;
  is_mono_clear: boolean;
  is_mono_install: boolean;
  is_mono_build: boolean;
  is_mono_link: boolean;
  is_mono_bootstrap: boolean;
  is_mono_test: boolean;
  is_mono_publish: boolean;
  is_mono_publish_patch: boolean;
  is_mono_publish_minor: boolean;
  is_mono_publish_major: boolean;

  resolveLocalModule(name: string): string;
  resolveGlobalModule(name: string): string;
  resolveDevModule(name: string): string;
}
