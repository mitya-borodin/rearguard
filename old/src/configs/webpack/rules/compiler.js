import {
  babelEnvServer,
  babelEnvSpa,
  context,
  isDevelopment,
  isProduction,
  isInferno,
  isOldNode,
  isReact,
  isTS,
  isVeryOldNode,
  tmpTypescryptConfigPath,
} from '../../prepare.build-tools.config';
import resolveBuildToolsModules from '../../utils/resolveBuildToolsModules';

export default (
  {
    babel: {
      presets = [],
      plugins = [],
      envPreset = [],
    } = {},
    exclude = [/node_modules/, /mobx.js/],
  } = {},
  isServerSide = false,
) => {
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
      resolveBuildToolsModules('babel-preset-stage-2'),
      ...isReact ? [
        // JSX, Flow
        // https://github.com/babel/babel/tree/master/packages/babel-preset-react
        resolveBuildToolsModules('babel-preset-react'),
      ] : [],
      ...isInferno ? ['inferno', { imports: true }] : [],
      ...presets,
    ],
    plugins: [
      ...isOldNode ? [resolveBuildToolsModules('babel-plugin-transform-regenerator')] : [],
      resolveBuildToolsModules('babel-plugin-transform-decorators-legacy'),
      resolveBuildToolsModules('babel-plugin-mobx-deep-action'),
      ...isReact && isProduction ? [
        resolveBuildToolsModules('babel-plugin-transform-react-constant-elements'),
        resolveBuildToolsModules('babel-plugin-transform-react-inline-elements'),
        resolveBuildToolsModules('babel-plugin-transform-react-remove-prop-types'),
        resolveBuildToolsModules('babel-plugin-transform-react-pure-class-to-function'),
      ] : [],
      ...plugins,
      [
        resolveBuildToolsModules('babel-plugin-transform-runtime'),
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
              configFileName: tmpTypescryptConfigPath,
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
