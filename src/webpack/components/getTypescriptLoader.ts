import path from "path";
import resolve from "resolve";
import webpack from "webpack";
import PnpWebpackPlugin from "pnp-webpack-plugin";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { TS_CONFIG_FILE_NAME } from "../../const";
import { getLocalNodeModulePath } from "../../helpers/dependencyPaths";

export const getTypescriptLoader = (
  CWD: string,
): {
  eslintLoader: webpack.RuleSetRule | undefined;
  tsLoader: webpack.RuleSetRule;
} => {
  const rearguardConfig = new RearguardConfig(CWD);
  const isDll = rearguardConfig.isDll();
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const configFilePath = path.resolve(CWD, TS_CONFIG_FILE_NAME);

  // * Prepare settings
  const include = [contextPath];
  const test = /\.(ts|tsx|js|jsx)?$/;

  const rules: {
    eslintLoader: webpack.RuleSetRule | undefined;
    tsLoader: webpack.RuleSetRule;
  } = {
    eslintLoader: undefined,
    tsLoader: {
      test,
      include,
      use: [
        {
          loader: "ts-loader",
          options: PnpWebpackPlugin.tsLoaderOptions({
            configFile: configFilePath,
            context: CWD,
            experimentalFileCaching: false,
          }),
        },
      ],
    },
  };

  if (!isDll) {
    rules.eslintLoader = {
      enforce: "pre",
      test,
      exclude: /node_modules/,
      include,
      loader: "eslint-loader",
      options: {
        eslintPath: resolve.sync("eslint", {
          basedir: getLocalNodeModulePath(CWD),
        }),
        cache: true,
        formatter: "stylish",
        failOnError: true,
        failOnWarning: false,
        cwd: CWD,
      },
    };
  }

  return rules;
};
