import * as webpack from "webpack";
import {definePlugin/*, TS*/} from "./plugins/js";
import {externalCSS, globalCSS, internalCSS} from "./rules/css";
import {file} from "./rules/files";
import {context, entry as defaultEntry, isDevelopment, isSourceMap, isTS, modules, output as defaultOutput, stats} from "./target.config";

export default (
  {
    entry = defaultEntry,
    output = {},
    target = "web",
    rules = [],
    plugins = [],
    externals = [],
    node = {
      fs: "empty",
      net: "empty",
      tls: "empty",
    },
    devtool = isDevelopment && isSourceMap ? "source-map" : false,
  }: {
    entry?: string[] | string | { [key: string]: string };
    output?: { [key: string]: string };
    target?: string;
    rules?: any[];
    plugins?: any[];
    externals?: any[];
    node?: { [key: string]: string | boolean } | boolean;
    devtool?: string | boolean;
  },
) => ({
  bail: !isDevelopment,
  cache: isDevelopment,
  context,
  devtool,
  entry,
  externals,
  module: {
    rules: [
      ...rules,
      internalCSS(),
      globalCSS(),
      externalCSS(),
      file(),
    ],
  },
  node,
  output: {...defaultOutput, ...output},
  performance: {
    hints: !isDevelopment ? "warning" : false, // enum
    maxAssetSize: 1000000, // int (in bytes),
    maxEntrypointSize: 1000000, // int (in bytes)
  },
  plugins: [
    // ...TS(),
    definePlugin(),
    ...isTS ? [new webpack.WatchIgnorePlugin([/css\.d\.ts$/])] : [],
    ...plugins,
  ],
  resolve: {
    extensions: [...isTS ? [".ts", ".tsx"] : [], ".js", ".jsx", ".css", ".json"],
    modules,
  },
  resolveLoader: {
    extensions: [".js", ".json"],
    mainFields: ["loader", "main"],
    modules,
  },
  stats,
  target,
});
