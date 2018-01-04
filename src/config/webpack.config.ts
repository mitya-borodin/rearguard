import generalWebpackConfig from "./general.webpack.config";
import entry from "./general/entry";
import { extractCSS } from "./plugins/css";
import { analyze, definePlugin, extractVendors, HMR, htmlWebpackPlugin, scopeHoisting, uglify } from "./plugins/js";
import compiler from "./rules/compiler";
import { output } from "./target.config";

export const dev = generalWebpackConfig(
  entry(),
  output,
  compiler(),
  [
    ...definePlugin(),
    ...HMR(),
    ...extractCSS(),
    ...scopeHoisting(),
    ...extractVendors(),
    ...uglify(),
    ...htmlWebpackPlugin(),
    ...analyze(),
  ],
  {},
);
