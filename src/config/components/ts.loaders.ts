import * as webpack from "webpack";
import {context, output, tsConfigPath, tsLintConfigPath} from "./target.config";

const tsLint = (exclude: Array<string | RegExp>, include: string[], test: RegExp): webpack.Rule => ({
  enforce: "pre",
  exclude,
  include,
  loader: "tslint-loader",
  options: {
    configFile: tsLintConfigPath,
  },
  test,
});

export default (): webpack.Rule[] => {
  const exclude = [/node_modules/];
  const include = [context];
  const TS = /\.(ts|tsx)?$/;
  const webWorkerTS = /\.worker\.ts?$/;

  return [
    tsLint(exclude, include, TS),
    {
      exclude,
      include,
      test: TS,
      use: [
        {
          loader: "ts-loader",
          options: {
            configFile: tsConfigPath,
            // happyPackMode: true,
            // disable type checker - we will use it in fork plugin
            // transpileOnly: true,
          },
        },
      ],
    },
    tsLint(exclude, include, webWorkerTS),
    {
      exclude,
      include,
      test: webWorkerTS,
      use: [
        {
          loader: "worker-loader",
          options: {
            name: "[name].[hash].js",
            publicPath: output.publicPath,
          },
        },
        {
          loader: "ts-loader",
          options: {
            configFile: tsConfigPath,
            // happyPackMode: true,
            // disable type checker - we will use it in fork plugin
            // transpileOnly: true,
          },
        },
      ],
    },
  ];
};
