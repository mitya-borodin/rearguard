export interface IBundleInfo {
  pkg_name: string;
  bundle_name: string;
  has_dll: boolean;
  has_browser_lib: boolean;
  load_on_demand: boolean;
  bundle_entry_name: { dll: string; lib: string };
  assets: { dll: string; lib: string };
  manifest: string;
}
