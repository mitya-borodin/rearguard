import {
  context,
  entry as defaultEntry,
  isDebug,
  isDevelopment,
  isProduction,
  isTS,
  modules,
  output as defaultOutput,
  stats,
} from '../prepare.build-tools.config';
import { analyze, defineEnv } from './plugins/js';

export default ({
                  entry = defaultEntry, output = {}, target = 'web', rules = [], plugins = [], externals = [],
                  node = {
                    fs: 'empty',
                    net: 'empty',
                    tls: 'empty',
                  },
                  devtool = isDevelopment ? 'cheap-module-source-map' : false,
                }) => {
  const _output = Object.assign({}, defaultOutput, output);
  let devTool = devtool;

  if (isDebug) {
    devTool = isDevelopment ? 'inline-source-map' : false;
  }

  return {
    context,
    entry,
    output: _output,
    target,
    resolve: {
      modules,
      extensions: ['.css', '.json', ...isTS ? ['.ts', '.tsx'] : [], '.js', '.jsx'],
    },
    resolveLoader: {
      modules,
      extensions: ['.js', '.json'],
      mainFields: ['loader', 'main'],
    },
    module: { rules },
    stats,
    externals,
    devtool: devTool,
    plugins: [
      defineEnv(),
      ...plugins,
      ...analyze(),
    ],
    node,
    bail: isProduction,
    cache: isDevelopment,
    performance: {
      hints: isProduction ? 'warning' : false, // enum
      maxAssetSize: 1000000, // int (in bytes),
      maxEntrypointSize: 1000000, // int (in bytes)
    },
  };
};
