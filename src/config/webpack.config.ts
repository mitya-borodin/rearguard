import generalWebpackConfig from "./general.webpack.config";
import entry from "./general/entry";
import { extractCSS } from "./plugins/css";
import { analyze, extractVendors, HMR, htmlWebpackPlugin, uglify } from "./plugins/js";
import compiler from "./rules/compiler";
import { output } from "./target.config";

const config = generalWebpackConfig(
  entry(),
  output,
  compiler(),
  [
    ...HMR(),
    ...extractVendors(),
    ...uglify(),
    ...extractCSS(),
    ...htmlWebpackPlugin(),
    ...analyze(),
  ],
  "",
);

export default config;
