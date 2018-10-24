import * as HardSourceWebpackPlugin from "hard-source-webpack-plugin";
import * as path from "path";
import { analyze, DllReferencePlugin } from "./components/js.plugins";
import {
  context,
  lib_entry,
  lib_file_name,
  lib_name,
  output,
  root,
} from "./components/target.config";
import tsLoader from "./components/ts.loaders";
import { general_WP_config } from "./general.webpack.config";

export const library = general_WP_config(
  {
    [lib_name]: path.resolve(context, lib_entry),
  },
  {
    ...output,
    filename: lib_file_name,
    library: lib_name,
    libraryTarget: "umd",
  },
  tsLoader(),
  [
    ...DllReferencePlugin(),
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(
        root,
        ".cache/library-hard-source/[confighash]",
      ),
      configHash: (webpackConfig: any) => {
        return require("node-object-hash")({ sort: false }).hash(webpackConfig);
      },
      environmentHash: {
        directories: [],
        files: ["package-lock.json"],
        root: process.cwd(),
      },
    }),
    ...analyze(),
  ],
  {},
);
