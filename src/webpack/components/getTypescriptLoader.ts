import webpack from "webpack";
import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { TS_CONFIG_FILE_NAME } from "../../const";

export const getTypescriptLoader = (CWD: string): webpack.RuleSetRule[] => {
  // * Prepare config
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare paths
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const configFilePath = path.resolve(CWD, TS_CONFIG_FILE_NAME);

  // * Prepare settings
  const include = [contextPath];
  const test = /\.(ts|tsx)?$/;

  return [
    /*     {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      enforce: "pre",
      use: [
        {
          options: {
            cache: true,
            formatter: require.resolve("react-dev-utils/eslintFormatter"),
            eslintPath: require.resolve("eslint"),
            resolvePluginsRelativeTo: __dirname,
            // @remove-on-eject-begin
            ignore: process.env.EXTEND_ESLINT === "true",
            baseConfig: (() => {
              // We allow overriding the config only if the env variable is set
              if (process.env.EXTEND_ESLINT === "true") {
                const eslintCli = new eslint.CLIEngine();
                let eslintConfig;
                try {
                  eslintConfig = eslintCli.getConfigForFile(paths.appIndexJs);
                } catch (e) {
                  console.error(e);
                  process.exit(1);
                }
                return eslintConfig;
              } else {
                return {
                  extends: [require.resolve("eslint-config-react-app")],
                };
              }
            })(),
            useEslintrc: false,
            // @remove-on-eject-end
          },
          loader: require.resolve("eslint-loader"),
        },
      ],
      include: paths.appSrc,
    }, */
    {
      include,
      test,
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
