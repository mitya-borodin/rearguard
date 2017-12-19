import { context, isDebug, ts } from "../target.config";

export default (): any[] => {
  const exclude = [/node_modules/, /\.d\.ts$/];
  const include = [context];
  const test = /\.(ts|tsx)?$/;

  return [
    ...isDebug
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
        configFile: ts.lint,
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
            configFile: ts.path,
            // happyPackMode: true,
            // disable type checker - we will use it in fork plugin
            // transpileOnly: true,
          },
        },
      ],
    },
  ];
};
