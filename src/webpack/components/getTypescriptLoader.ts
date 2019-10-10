import webpack from "webpack";
import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { TS_CONFIG_FILE_NAME } from "../../const";

export const getTypescriptLoader = (CWD: string): webpack.RuleSetRule[] => {
  // * Prepare config
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare paths
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const configFilePath = path.resolve(contextPath, TS_CONFIG_FILE_NAME);

  // * Prepare settings
  const include = [contextPath];
  const test = /\.(ts|tsx)?$/;

  return [
    // TODO Change to ESLint
    /*     {
      enforce: "pre",
      include,
      loader: "tslint-loader",
      options: {
        configFile: tsLintConfig.config_path,
        tsConfigFile: configFilePath,
      },
      test,
    }, */
    {
      include,
      test,
      use: [
        {
          loader: "ts-loader",
          options: {
            configFile: configFilePath,
            context: contextPath,
            experimentalFileCaching: false,
          },
        },
      ],
    },
  ];
};
