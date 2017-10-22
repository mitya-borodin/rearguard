import {babelEnvServer, babelEnvSpa, context, isDevelopment, isInferno, isOldNode, isReact, isTS, resolveNodeModules, typescriptConfigFilePath,} from "../target.config";

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
      ...isOldNode ? [resolveNodeModules("babel-plugin-transform-regenerator")] : [],
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
      {
        enforce: "pre",
        exclude,
        include,
        loader: "source-map-loader",
        test: /\.js$/,
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
