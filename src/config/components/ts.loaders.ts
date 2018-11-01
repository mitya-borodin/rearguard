import * as webpack from "webpack";
import { context, tsConfigPath, tsLintConfigPath } from "./target.config";

export default (): webpack.Rule[] => {
  const include = [context];
  const test = /\.(ts|tsx)?$/;

  return [
    {
      enforce: "pre",
      exclude(modulePath) {
        return /node_modules/.test(modulePath);
      },
      include,
      loader: "tslint-loader",
      options: {
        configFile: tsLintConfigPath,
      },
      test,
    },
    {
      exclude(modulePath) {
        return /node_modules/.test(modulePath);
      },
      include,
      test,
      use: [
        {
          loader: "ts-loader",
          options: {
            configFile: tsConfigPath,
          },
        },
      ],
    },
  ];
};
