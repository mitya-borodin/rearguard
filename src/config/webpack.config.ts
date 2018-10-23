import entry from "./components/entry";
import {
  analyze,
  DllReferencePlugin,
  HMR,
  htmlWebpackPlugin,
  workboxPlugin,
} from "./components/js.plugins";
import { output } from "./components/target.config";
import tsLoader from "./components/ts.loaders";
import generalWebpackConfig from "./general.webpack.config";

export const main = generalWebpackConfig(
  entry(),
  output,
  tsLoader(),
  [
    ...DllReferencePlugin(),
    ...HMR(),
    ...workboxPlugin(),
    ...htmlWebpackPlugin(),
    ...analyze(),
  ],
  {},
);
