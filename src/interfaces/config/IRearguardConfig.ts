import { IConfig } from "./IConfig";

export interface IRearguardConfig extends IConfig {
  context: string;
  entry: string;
  dll_entry: string;
  lib_entry: string;
  modules: string[];
  output: { path: string; publicPath: string };
  bundle_public_path: string;
  post_css_plugins_path: string;
  sync_project_deps: string[];
  has_dll: boolean;
  has_node_lib: boolean;
  has_ui_lib: boolean;
  has_project: boolean;
  publish_in_git: boolean;

  order_config_fields(): void;
}
