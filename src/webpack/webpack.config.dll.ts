import * as path from "path";
import { get_context } from "../helpers";
import { analyze, assetsPlugin, DllPlugin } from "./components/js.plugins";
import { dll_bundle_dirname, dll_entry, dll_entry_name, output } from "./components/target.config";
import tsLoader from "./components/ts.loaders";
import { general_WP_config } from "./general.webpack.config";

export function dll_WP_config() {
  return general_WP_config(
    {
      [dll_entry_name]: [path.resolve(get_context(), dll_entry)],
    },
    {
      ...output,
      library: dll_entry_name,
      libraryTarget: "var",
    },
    tsLoader(),
    [...DllPlugin(), ...assetsPlugin(dll_bundle_dirname), ...analyze()],
    {},
  );
}
