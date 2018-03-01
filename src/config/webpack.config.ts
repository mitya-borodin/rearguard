import * as HardSourceWebpackPlugin from "hard-source-webpack-plugin";
import * as path from "path";
import entry from "./components/entry";
import {
  analyze,
  clean,
  DllPlugin,
  DllReferencePlugin,
  extractVendors,
  HMR,
  htmlWebpackPlugin,
  workboxPlugin,
} from "./components/js.plugins";
import {
  context,
  dll_entry_name,
  dll_lib_file_name,
  dll_lib_name,
  dll_lib_output_path,
  isDevelopment,
  output,
  root,
} from "./components/target.config";
import tsLoader from "./components/ts.loaders";
import generalWebpackConfig from "./general.webpack.config";

export const dev = generalWebpackConfig(
  entry(),
  output,
  tsLoader(),
  [
    ...DllReferencePlugin(),
    ...HMR(),
    ...extractVendors(),
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
  tsLoader(),
  [
    ...clean([isDevelopment ? "dll/dev" : "dll/prod"], true),
    ...DllPlugin(),
    new HardSourceWebpackPlugin(
      {
        cacheDirectory: path.resolve(
          root,
          "node_modules/.cache/dll-hard-source/[confighash]",
        ),
        configHash: (webpackConfig: any) => {
          return require("node-object-hash")({sort: false}).hash(webpackConfig);
        },
        environmentHash: {
          directories: [],
          files: ["package-lock.json"],
          root: process.cwd(),
        },
        // Sets webpack"s recordsPath if not already set.
        recordsPath: path.resolve(
          root,
          "node_modules/.cache/dll-hard-source/[confighash]/records.json",
        ),
      },
    ),
  ],
  {},
);
