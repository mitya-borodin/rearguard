import {babelEnvServer, babelEnvSpa, context, isDevelopment, isInferno, isReact, isSourceMap, isTS, resolveNodeModules, tsLintConfigFilePath, typescriptConfigFilePath} from "../target.config";

export default (isServerSide = false, exclude = [/node_modules/]): any[] => {
  const babelEnvPreset = !isServerSide ? babelEnvSpa : babelEnvServer;
  const include = [context];
  const query = {
    // https://babeljs.io/docs/usage/options/
    babelrc: false,

    // https://github.com/babel/babel-loader#options
    cacheDirectory: isDevelopment,
    plugins: [
      resolveNodeModules("babel-plugin-transform-decorators-legacy"),
      ...isInferno && !isReact ? [[resolveNodeModules("babel-plugin-inferno"), {imports: true}]] : [],
      ...isReact && !isInferno && !isDevelopment
        ? [
          resolveNodeModules("babel-plugin-transform-react-constant-elements"),
          resolveNodeModules("babel-plugin-transform-react-inline-elements"),
          resolveNodeModules("babel-plugin-transform-react-remove-prop-types"),
          resolveNodeModules("babel-plugin-transform-react-pure-class-to-function"),
        ]
        : [],
      [resolveNodeModules("babel-plugin-transform-runtime")],
    ],
    presets: [
      babelEnvPreset,
      // Stage 2: draft
      // https://babeljs.io/docs/plugins/preset-stage-2/
      resolveNodeModules("babel-preset-stage-2"),
      // JSX, Flow
      // https://github.com/babel/babel/tree/master/packages/babel-preset-react
      ...isReact ? [resolveNodeModules("babel-preset-react")] : [],
    ],
  };

  if (isTS) {
    return [
      ...isSourceMap
        ? [
          {
            enforce: "pre",
            exclude,
            include,
            loader: "source-map-loader",
            test: /\.js$/,
          },
        ]
        : [],
      {
        enforce: "pre",
        loader: "tslint-loader",
        options: {
          configFile: tsLintConfigFilePath,
        },
        test: /\.(ts|tsx)?$/,
      },
      {
        exclude,
        include,
        test: /\.(ts|tsx)?$/,
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
      {
        exclude,
        include,
        loader: "babel-loader",
        query,
        test: /\.(js|jsx)?$/,
      },
    ];
  }
  return [
    {
      exclude,
      include,
      loader: "babel-loader",
      query,
      test: /\.(js|jsx)?$/,
    },
  ];
};
