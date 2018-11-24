import * as webpack from "webpack";
import { get_context } from "../../helpers";

export default (): webpack.Rule[] => {
  const include = [get_context()];
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
