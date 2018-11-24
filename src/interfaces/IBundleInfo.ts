export interface IBundleInfo {
  has_dll: boolean;
  has_ui_lib: boolean;
  bundle_name: string;
  bundle_entry_name: { dll: string; lib: string };
  assets: { dll: string; lib: string };
  manifest: string;
}
