import { IVersionableConfig } from "./IVersionableConfig";

export interface IRearguardConfig extends IVersionableConfig {
  context: string;
  entry: string;
  dll_entry: string;
  lib_entry: string;
  modules: string[];
  output: { path: string; publicPath: string };
  post_css_plugins_path: string;
  sync_npm_deps: string[];
  has_dll: boolean;
  has_node_lib: boolean;
  has_ui_lib: boolean;
}
