import {
  babelEnvServer,
  babelEnvSpa,
  context,
  isDevelopment,
  isInferno,
  isOldNode,
  isReact,
  isTS,
  isVeryOldNode,
  resolveNodeModules,
  typescriptConfigFilePath,
} from "../target.config";

export default (
  {
    babel: {
      presets = [],
      plugins = [],
      envPreset = [],
    } = {},
    exclude = [/node_modules/],
  } = {},
  isServerSide = false,
): any[] => {
  let babelEnvPreset = [];

  if (envPreset.length > 0) {
    babelEnvPreset = envPreset;
  } else {
    babelEnvPreset = !isServerSide ? babelEnvSpa : babelEnvServer;
  }

  const common = {
    exclude,
    include: [context],
  };
  const query = {
    // https://babeljs.io/docs/usage/options/
    babelrc: false,

    // https://github.com/babel/babel-loader#options
    cacheDirectory: isDevelopment,
    plugins: [
      resolveNodeModules("babel-plugin-transform-decorators-legacy"),
      ...isOldNode ? [resolveNodeModules("babel-plugin-transform-regenerator")] : [],
      ...isInferno && !isReact
        ? [
          [resolveNodeModules("babel-plugin-inferno"), { imports: true }],
        ]
        : [],
      ...isReact && !isInferno && !isDevelopment
        ? [
          resolveNodeModules("babel-plugin-transform-react-constant-elements"),
          resolveNodeModules("babel-plugin-transform-react-inline-elements"),
          resolveNodeModules("babel-plugin-transform-react-remove-prop-types"),
          resolveNodeModules("babel-plugin-transform-react-pure-class-to-function"),
        ]
        : [],
      ...plugins,
      [
        resolveNodeModules("babel-plugin-transform-runtime"),
        isServerSide
          ? {
            helpers: isOldNode,
            moduleName: "babel-runtime",
            polyfill: isVeryOldNode,
            regenerator: isOldNode,
          }
          : {
            helpers: isOldNode,
            moduleName: "babel-runtime",
            polyfill: isVeryOldNode,
            regenerator: isOldNode,
          },
      ],
    ],
    presets: [
      babelEnvPreset,
      // Stage 2: draft
      // https://babeljs.io/docs/plugins/preset-stage-2/
      resolveNodeModules("babel-preset-stage-2"),

      ...isReact
        ? [
          // JSX, Flow
          // https://github.com/babel/babel/tree/master/packages/babel-preset-react
          resolveNodeModules("babel-preset-react"),
        ]
        : [],

      ...presets,
    ],
  };

  if (isTS) {
    return [
      {
        test: /\.js$/,
        ...common,
        enforce: "pre",
        loader: "source-map-loader",
      },
      {
        test: /\.(ts|tsx)?$/,
        ...common,
        use: [
          {
            loader: "babel-loader",
            query,
          },
          {
            loader: "ts-loader",
            options: {
              configFileName: typescriptConfigFilePath,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)?$/,
        ...common,
        loader: "babel-loader",
        query,
      },
    ];
  }
  return [
    {
      test: /\.(js|jsx)?$/,
      ...common,
      loader: "babel-loader",
      query,
    },
  ];
};
