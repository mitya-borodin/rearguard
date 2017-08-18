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
  typescriptConfigFilePath,
  resolveNodeModules
} from '../target.config';

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
    // https://github.com/babel/babel-loader#options
    cacheDirectory: isDevelopment,

    // https://babeljs.io/docs/usage/options/
    babelrc: false,
    passPerPreset: true,
    presets: [
      babelEnvPreset,
      // Stage 2: draft
      // https://babeljs.io/docs/plugins/preset-stage-2/
      resolveNodeModules('babel-preset-stage-2'),
      ...isReact ? [
        // JSX, Flow
        // https://github.com/babel/babel/tree/master/packages/babel-preset-react
        resolveNodeModules('babel-preset-react'),
      ] : [],
      ...isInferno ? [resolveNodeModules('babel-plugin-inferno'), { imports: true }] : [],
      ...presets,
    ],
    plugins: [
      ...isOldNode ? [resolveNodeModules('babel-plugin-transform-regenerator')] : [],
      resolveNodeModules('babel-plugin-mobx-deep-action'),
      resolveNodeModules('babel-plugin-transform-decorators-legacy'),
      ...isReact && !isDevelopment ? [
        resolveNodeModules('babel-plugin-transform-react-constant-elements'),
        resolveNodeModules('babel-plugin-transform-react-inline-elements'),
        resolveNodeModules('babel-plugin-transform-react-remove-prop-types'),
        resolveNodeModules('babel-plugin-transform-react-pure-class-to-function'),
      ] : [],
      ...plugins,
      [
        resolveNodeModules('babel-plugin-transform-runtime'),
        {
          helpers: isOldNode || true,
          polyfill: isVeryOldNode,
          regenerator: isOldNode,
          moduleName: 'babel-runtime',
        },
      ],
    ],
  };

  if (isTS) {
    return [
      {
        test: /\.js$/,
        ...common,
        enforce: 'pre',
        loader: 'source-map-loader',
      },
      {
        test: /\.(ts|tsx)?$/,
        ...common,
        use: [
          {
            loader: 'babel-loader',
            query,
          },
          {
            loader: 'ts-loader',
            options: {
              configFileName: typescriptConfigFilePath,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)?$/,
        ...common,
        loader: 'babel-loader',
        query,
      },
    ];
  }
  return [
    {
      test: /\.(js|jsx)?$/,
      ...common,
      loader: 'babel-loader',
      query,
    },
  ];
};
