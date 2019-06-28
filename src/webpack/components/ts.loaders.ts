import * as webpack from "webpack";
import { tsLintConfig } from "../../config/tslint";
import { typescriptConfig } from "../../config/typescript";
import { get_context } from "../../helpers";

export default (): webpack.Rule[] => {
  const include = [get_context()];
  const test = /\.(ts|tsx)?$/;

  return [
    {
      enforce: "pre",
      include,
      loader: "tslint-loader",
      options: {
        configFile: tsLintConfig.config_path,
        context: get_context(),
        experimentalFileCaching: false,
      },
      test,
    },
    {
      include,
      test,
      use: [
        {
          loader: "ts-loader",
          options: {
            configFile: typescriptConfig.config_path,
            context: get_context(),
            experimentalFileCaching: false,
          },
        },
      ],
    },
  ];
};
