import * as path from "path";
import { analyze, assets, DllPlugin } from "./components/js.plugins";
import { context, dll_bundle_dirname, dll_entry, dll_entry_name, output } from "./components/target.config";
import tsLoader from "./components/ts.loaders";
import { general_WP_config } from "./general.webpack.config";

export function dll_WP_config() {
  return general_WP_config(
    {
      [dll_entry_name]: [path.resolve(context, dll_entry)],
    },
    {
      ...output,
      library: dll_entry_name,
      libraryTarget: "var",
    },
    tsLoader(),
    [...DllPlugin(), ...assets(dll_bundle_dirname), ...analyze()],
    {},
  );
}
