import * as HardSourceWebpackPlugin from "hard-source-webpack-plugin";
import * as path from "path";
import entry from "./entry";
import generalWebpackConfig from "./general.webpack.config";
import { extractCSS } from "./plugins/css";
import { analyze, clean, definePlugin, DllPlugin, DllReferencePlugin, extractVendors, HMR, htmlWebpackPlugin, scopeHoisting, uglify, workboxPlugin } from "./plugins/js";
import compiler from "./rules/compiler";
import { context, dll_entry_name, dll_lib_file_name, dll_lib_name, dll_lib_output_path, isDevelopment, output, root } from "./target.config";

export const dev = generalWebpackConfig(
  entry(),
  output,
  compiler(),
  [
    ...DllReferencePlugin(),
    ...definePlugin(),
    ...scopeHoisting(),
    ...HMR(),
    ...extractVendors(),
    ...extractCSS(),
    ...uglify(),
    ...workboxPlugin(),
    ...htmlWebpackPlugin(),
    ...analyze(),
  ],
  {},
);

export const dll = generalWebpackConfig(
  {
    [dll_entry_name]: [path.resolve(context, "vendors.ts")],
  },
  {
    ...output,
    filename: dll_lib_file_name,
    library: dll_lib_name,
    path: dll_lib_output_path,
  },
  compiler(),
  [
    ...clean([isDevelopment ? "dll/dev" : "dll/prod"], true),
    ...definePlugin(),
    ...extractCSS(true),
    ...uglify(),
    ...DllPlugin(),
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(root, "node_modules/.cache/dll-hard-source/[confighash]"),
      configHash: (webpackConfig: any) => {
        return require("node-object-hash")({ sort: false }).hash(webpackConfig);
      },
      environmentHash: {
        directories: [],
        files: ["package-lock.json"],
        root: process.cwd(),
      },
      // Sets webpack"s recordsPath if not already set.
      recordsPath: path.resolve(root, "node_modules/.cache/dll-hard-source/[confighash]/records.json"),
    }),
  ],
  {},
);
