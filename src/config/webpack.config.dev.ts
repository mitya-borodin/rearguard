import entry from "./components/entry";
import {
  analyze,
  DllReferencePlugin,
  HMR,
  htmlWebpackPlugin,
  workboxPlugin,
} from "./components/js.plugins";
import { isLib, output } from "./components/target.config";
import tsLoader from "./components/ts.loaders";
import { general_WP_config } from "./general.webpack.config";

export const dev = general_WP_config(
  entry(),
  output,
  tsLoader(),
  [
    ...DllReferencePlugin(),
    ...(!isLib ? HMR() : []),
    ...(!isLib ? workboxPlugin() : []),
    ...htmlWebpackPlugin(),
    ...analyze(),
  ],
  {},
);
