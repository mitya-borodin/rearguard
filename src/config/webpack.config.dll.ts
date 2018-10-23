import * as HardSourceWebpackPlugin from "hard-source-webpack-plugin";
import * as path from "path";
import { DllPlugin } from "./components/js.plugins";
import {
  dll_entry,
  dll_lib_file_name,
  dll_lib_name,
  output,
  root,
} from "./components/target.config";
import tsLoader from "./components/ts.loaders";
import generalWebpackConfig from "./general.webpack.config";

export const dll = generalWebpackConfig(
  {
    [dll_lib_name]: [path.resolve(root, dll_entry)],
  },
  {
    ...output,
    filename: dll_lib_file_name,
    library: dll_lib_name,
    libraryTarget: "var",
  },
  tsLoader(),
  [
    ...DllPlugin(),
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(
        root,
        ".cache/dll-hard-source/dll/[confighash]",
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
  ],
  {},
);
