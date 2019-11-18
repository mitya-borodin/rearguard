import path from "path";
import webpack from "webpack";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { TS_CONFIG_FILE_NAME } from "../../const";

export const getTypescriptLoader = (CWD: string): webpack.RuleSetRule[] => {
  const rearguardConfig = new RearguardConfig(CWD);
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const configFilePath = path.resolve(CWD, TS_CONFIG_FILE_NAME);

  // * Prepare settings
  const include = [contextPath];
  const test = /\.(ts|tsx)?$/;

  return [
    {
      enforce: "pre",
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      include,
      loader: "eslint-loader",
      options: {
        cache: true,
        formatter: "stylish",
        failOnError: true,
        failOnWarning: false,
        cwd: CWD,
      },
    },
    {
      test,
      include,
      use: [
        {
          loader: "ts-loader",
          options: {
            configFile: configFilePath,
            context: CWD,
            experimentalFileCaching: false,
          },
        },
      ],
    },
  ];
};
