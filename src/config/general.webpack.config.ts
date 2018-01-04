import * as webpack from "webpack";
import { Entry, EntryFunc } from "webpack";
import CSS from "./rules/css";
import { file } from "./rules/files";
import { context, isDebug, isDevelopment, modules, stats } from "./target.config";

export default (
  entry: string | string[] | Entry | EntryFunc,
  output: webpack.Output,
  rules: webpack.Rule[],
  plugins: webpack.Plugin[],
  externals: webpack.ExternalsFunctionElement | webpack.ExternalsObjectElement | webpack.ExternalsElement,
): webpack.Configuration => ({
  bail: !isDevelopment,
  cache: true,
  context,
  devtool: isDebug ? "source-map" : false,
  entry,
  externals,
  module: {
    rules: [...rules, ...CSS(), file()],
  },
  output,
  performance: {
    hints: false,
  },
  plugins: [
    new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/,
    ]),
    ...plugins,
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".css", ".json"],
    modules,
  },
  resolveLoader: {
    extensions: [".js", ".json"],
    mainFields: ["loader", "main"],
    modules,
  },
  stats,
});
