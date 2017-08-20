import { analyze, definePlugin } from './plugins/js';
import {
  context,
  entry as defaultEntry,
  isDebug,
  isDevelopment,
  isTS,
  modules,
  output as defaultOutput,
  stats
} from './target.config';
import { externalCSS, internalCSS } from './rules/css';
import { file } from './rules/files';

export default (
  {
    entry = defaultEntry,
    output = {},
    target = 'web',
    rules = [],
    plugins = [],
    externals = [],
    node = {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
    devtool = isDevelopment ? 'cheap-module-source-map' : false,
  }: {
    entry?: string[] | string | { [key: string]: string };
    output?: { [key: string]: string };
    target?: string;
    rules?: any[];
    plugins?: any[];
    externals?: any[];
    node?: { [key: string]: string | boolean } | boolean;
    devtool?: string | boolean;
  }
) => ({
  context,
  entry,
  output: { ...defaultOutput, ...output },
  target,
  resolve: {
    modules,
    extensions: [...isTS ? ['.ts', '.tsx'] : [], '.js', '.jsx', '.css', '.json'],
  },
  resolveLoader: {
    modules,
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main'],
  },
  module: {
    rules: [
      ...rules,
      internalCSS(),
      externalCSS(),
      file(),
    ]
  },
  stats,
  externals,
  devtool: isDebug ? (isDevelopment ? 'inline-source-map' : false) : devtool,
  plugins: [
    definePlugin(),
    ...plugins,
    ...analyze(),
  ],
  bail: !isDevelopment,
  cache: isDevelopment,
  performance: {
    hints: !isDevelopment ? 'warning' : false, // enum
    maxAssetSize: 1000000, // int (in bytes),
    maxEntrypointSize: 1000000, // int (in bytes)
  },
  node
})
