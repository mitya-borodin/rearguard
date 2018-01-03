import * as path from "path";
import * as webpack from "webpack";
import generalWebpackConfig from "./general.webpack.config";
import entry from "./general/entry";
import { extractCSS } from "./plugins/css";
import { definePlugin, extractVendors, htmlWebpackPlugin } from "./plugins/js";
import compiler from "./rules/compiler";
import { context, output, root } from "./target.config";

export const dev = generalWebpackConfig(
  entry(),
  output,
  compiler(),
  [
    new webpack.DllReferencePlugin({
      context,
      manifest: "dll/vendor-manifest.json",
    }),
    ...definePlugin(),
    // ...scopeHoisting(),
    // ...HMR(),
    // ...extractVendors(),
    // ...uglify(),
    ...extractCSS(),
    ...htmlWebpackPlugin(),
    // ...analyze(),
  ],
  {},
  // nodeExternals({ whitelist: [/\.css/] }),
);

console.log(JSON.stringify(dev, null, 2));

export const dll = generalWebpackConfig(
  entry([], true),
  {
    ...output,
    filename: "dll.[name].js",
    library: "[name]",
    path: path.join(root, "dist", "dll"),
  },
  compiler(),
  [
    ...definePlugin(),
    ...extractCSS(),
    ...extractVendors(),
    // ...uglify(),
    new webpack.DllPlugin({
      context,
      // The name of the global variable which the library"s
      // require function has been assigned to. This must match the
      // output.library option above
      name: "[name]",
      // The path to the manifest file which maps between
      // modules included in a bundle and the internal IDs
      // within that bundle
      path: "dll/[name]-manifest.json",
    }),
  ],
  {},
);

console.log(JSON.stringify(dll, null, 2));
