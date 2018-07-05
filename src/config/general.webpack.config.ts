import * as path from "path";
import * as webpack from "webpack";
import { Entry, EntryFunc } from "webpack";
import cssLoaders from "./components/css.loders";
import { uglify } from "./components/js.plugins";
import {
  context,
  isDebug,
  isDevelopment,
  modules,
  root,
  stats,
} from "./components/target.config";

export default (
  entry: string | string[] | Entry | EntryFunc,
  output: webpack.Output & { globalObject: string },
  rules: webpack.Rule[],
  plugins: webpack.Plugin[],
  externals:
    | webpack.ExternalsFunctionElement
    | webpack.ExternalsObjectElement
    | webpack.ExternalsElement,
): any => ({
  bail: !isDevelopment,
  cache: true,
  context,
  devtool: isDebug ? "source-map" : false,
  entry,
  externals,
  mode: isDevelopment ? "development" : "production",
  module: {
    rules: [
      {
        loader: "file-loader",
        query: {
          name: isDevelopment
            ? "[path][name].[ext]?[hash:8]"
            : "[hash:32].[ext]",
        },
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
      },
      ...cssLoaders(),
      ...rules,
    ],
  },
  optimization: {
    minimize: false,
  },
  output,
  performance: {
    hints: false,
  },
  plugins: [...plugins, ...uglify()],
  profile: true,
  recordsPath: path.resolve(
    root,
    "node_modules/.cache/webpack/[confighash]/records.json",
  ),
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
