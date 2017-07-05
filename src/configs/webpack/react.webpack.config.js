import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import {
  babelEnvServer,
  babelEnvSpa,
  filenameServer,
  isDevelopment,
  isIsomorphic,
  isProduction,
  isRHL,
} from '../prepare.build-tools.config';
import generalWebpackConfig from './general.webpack.config';
import { isomorphicEntry, serverEntry, spaEntry } from './general/entry';
import { extractCSS } from './plugins/css';
import { extractVendors, getAssetsFile, getIndexHtmlFile, HMR, uglify } from './plugins/js';
import compiler from './rules/compiler';
import { externalCSS, internalCSS } from './rules/css';
import { file } from './rules/files';

const reactBabelPresets = [
  // JSX, Flow
  // https://github.com/babel/babel/tree/master/packages/babel-preset-react
  'react',

  // Optimize React code for the production build
  // https://github.com/thejameskyle/babel-react-optimize
  // https://github.com/thejameskyle/babel-react-optimize#transform-react-inline-elements
  // Note: You should use this with babel-runtime and babel-transform-runtime to avoid duplicating the helper code in every file.
  ...isProduction ? ['react-optimize'] : [],
];

const reactBabelPlugin = [
  // https://www.npmjs.com/package/babel-plugin-transform-runtime
  // Note: You should use this with babel-runtime and babel-transform-runtime to avoid duplicating the helper code in every file.
  ...isProduction ? ['transform-runtime'] : [],

  // http://gaearon.github.io/react-hot-loader/getstarted/
  ...isDevelopment && isRHL ? ['react-hot-loader/babel'] : [],

  // Adds component stack to warning messages
  // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source
  ...isDevelopment ? ['transform-react-jsx-source'] : [],

  // Adds __self attribute to JSX which React will use for some warnings
  // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-self
  ...isDevelopment ? ['transform-react-jsx-self'] : [],
];

const RHL_patch = isRHL ? ['react-hot-loader/patch'] : [];

const spa = generalWebpackConfig({
    entry: isIsomorphic ? isomorphicEntry([
      ...RHL_patch
    ]) : spaEntry([
      ...RHL_patch
    ]),
    rules: [
      ...compiler({
        babel: {
          presets: reactBabelPresets,
          plugins: reactBabelPlugin,
          envPreset: babelEnvSpa,
        },
        exclude: [/node_modules/, /mobx.js/],
      }),
      internalCSS(),
      externalCSS(),
      file(),
    ],
    plugins: [
      extractVendors(),
      ...extractCSS(),
      ...HMR(),
      ...uglify(),
      ...getAssetsFile(),
      ...getIndexHtmlFile()
    ],
  })
;

const server = generalWebpackConfig({
  entry: serverEntry(),
  target: 'node',
  output: {
    filename: filenameServer,
    libraryTarget: 'commonjs2',
  },
  rules: [
    // Override babel-preset-env configuration for Node.js
    ...compiler({
      babel: {
        presets: reactBabelPresets,
        plugins: reactBabelPlugin,
        envPreset: babelEnvServer,
      },
      exclude: [/node_modules/, /mobx.js/],
    }),
    internalCSS(),
    externalCSS(),
    file(),
  ],
  plugins: [

    // Do not create separate chunks of the server bundle
    // https://webpack.github.io/docs/list-of-plugins.html#limitchunkcountplugin
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),

    // Adds a banner to the top of each generated chunk
    // https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
  ],
  externals: [
    /^\.\/assets\.json$/,
    /^\.\/config\.json$/,
    nodeExternals({
      whitelist: /\.css/,
    }),
  ],
  devtool: isDevelopment ? 'cheap-module-source-map' : 'source-map',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
});

export default isIsomorphic ? [spa, server] : spa;
