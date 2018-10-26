import entry from "./components/entry";
import {
  /* analyze, */ DllReferencePlugin,
  /* HMR,  htmlWebpackPlugin  , workboxPlugin */
} from "./components/js.plugins";
import { output } from "./components/target.config";
import tsLoader from "./components/ts.loaders";
import { general_WP_config } from "./general.webpack.config";

export function main_WS_config() {
  return general_WP_config(
    entry(),
    output,
    tsLoader(),
    [...DllReferencePlugin() /* ...HMR(), */ /* ...workboxPlugin(),  ...htmlWebpackPlugin()   ...analyze() */],
    {},
  );
}
