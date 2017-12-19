import {context, isSourceMap, tsLintConfigFilePath, typescriptConfigFilePath} from "../target.config";

export default (): any[] => {
  const exclude = [/node_modules/, /\.d\.ts$/];
  const include = [context];
  const test = /\.(ts|tsx)?$/;

  return [
    ...isSourceMap
      ? [
        {
          enforce: "pre",
          exclude,
          include,
          loader: "source-map-loader",
          test: /\.(ts|tsx|js|jsx)?$/,
        },
      ]
      : [],
    {
      enforce: "pre",
      exclude,
      include,
      loader: "tslint-loader",
      options: {
        configFile: tsLintConfigFilePath,
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
            configFile: typescriptConfigFilePath,
            // happyPackMode: true,
            // disable type checker - we will use it in fork plugin
            // transpileOnly: true,
          },
        },
      ],
    },
  ];
};
