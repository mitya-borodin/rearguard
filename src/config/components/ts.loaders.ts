import * as webpack from "webpack";
import {context, tsConfigPath, tsLintConfigPath} from "./target.config";

export default (): webpack.Rule[] => {
  const exclude = [/node_modules/];
  const include = [context];
  const test = /\.(ts|tsx)?$/;

  return [
    {
      enforce: "pre",
      exclude,
      include,
      loader: "tslint-loader",
      options: {
        configFile: tsLintConfigPath,
      },
      test,
    },
    {
      exclude,
      include,
      test,
      use: [
        {
          loader: "ts-loader",
          options: {
            configFile: tsConfigPath,
            // happyPackMode: true,
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
          },
        },
      ],
    },
  ];
};
