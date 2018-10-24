import * as HardSourceWebpackPlugin from "hard-source-webpack-plugin";
import * as path from "path";
import { DllPlugin } from "./components/js.plugins";
import {
  context,
  dll_entry,
  dll_file_name,
  dll_name,
  output,
  root,
} from "./components/target.config";
import tsLoader from "./components/ts.loaders";
import { general_WP_config } from "./general.webpack.config";

export const dll = general_WP_config(
  {
    [dll_name]: [path.resolve(context, dll_entry)],
  },
  {
    ...output,
    filename: dll_file_name,
    library: dll_name,
    libraryTarget: "var",
  },
  tsLoader(),
  [
    ...DllPlugin(),
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(root, ".cache/dll-hard-source/[confighash]"),
      configHash: (webpackConfig: any) => {
        return require("node-object-hash")({ sort: false }).hash(webpackConfig);
      },
      environmentHash: {
        directories: [],
        files: ["package-lock.json"],
        root: process.cwd(),
      },
    }),
  ],
  {},
);
