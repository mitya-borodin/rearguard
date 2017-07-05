'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prepareBuildTools = require('../prepare.build-tools.config');

var _js = require('./plugins/js');

exports.default = ({
  entry = _prepareBuildTools.entry,
  output = {},
  target = 'web',
  rules = [],
  plugins = [],
  externals = [],
  node = {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  devtool = _prepareBuildTools.isDevelopment ? 'cheap-module-source-map' : false
}) => {

  let devTool = devtool;

  if (_prepareBuildTools.isDebug) {
    devTool = _prepareBuildTools.isDevelopment ? 'inline-source-map' : false;
  }

  return {
    context: _prepareBuildTools.context,
    entry,
    output: Object.assign({}, _prepareBuildTools.output, output),
    target,
    resolve: {
      modules: _prepareBuildTools.modules,
      extensions: ['.css', '.json', ...(_prepareBuildTools.isTS ? ['.ts', '.tsx'] : []), '.js', '.jsx']
    },
    module: { rules },
    stats: _prepareBuildTools.stats,
    externals,
    devtool: devTool,
    plugins: [(0, _js.defineEnv)(), ...plugins, ...(0, _js.analyze)()],
    node,
    bail: _prepareBuildTools.isProduction,
    cache: _prepareBuildTools.isDevelopment,
    performance: {
      hints: _prepareBuildTools.isProduction ? 'warning' : false, // enum
      maxAssetSize: 1000000, // int (in bytes),
      maxEntrypointSize: 1000000 // int (in bytes)
    }
  };
};
//# sourceMappingURL=general.webpack.config.js.map