import * as path from "path";
import * as webpack from "webpack";
import { analyze, assets, DllReferencePlugin } from "./components/js.plugins";
import { context, lib_bundle_dirname, lib_entry, lib_entry_name, output } from "./components/target.config";
import tsLoader from "./components/ts.loaders";
import { general_WP_config } from "./general.webpack.config";

export function library_WP_config(): webpack.Configuration {
  return general_WP_config(
    {
      [lib_entry_name]: path.resolve(context, lib_entry),
    },
    {
      ...output,
      library: lib_entry_name,
      libraryTarget: "var",
    },
    tsLoader(),
    [...DllReferencePlugin(), ...assets(lib_bundle_dirname), ...analyze()],
    {},
  );
}
