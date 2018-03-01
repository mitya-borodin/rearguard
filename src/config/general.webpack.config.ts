import {uglify} from "./components/js.plugins";
import * as webpack from "webpack";
import {Entry, EntryFunc} from "webpack";
import {definePlugin} from "../config/components/js.plugins";
import cssLoaders from "./components/css.loders";
import {context, isDebug, isDevelopment, modules, stats} from "./components/target.config";

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
    rules: [
      {
        loader: "file-loader",
        query: {
          name: isDevelopment ? "[path][name].[ext]?[hash:8]" : "[hash:32].[ext]",
        },
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
      },
      ...cssLoaders(),
      ...rules,
    ],
  },
  output,
  performance: {
    hints: false,
  },
  plugins: [
    ...definePlugin(),
    ...plugins,
    ...uglify(),
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
