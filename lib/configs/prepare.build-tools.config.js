'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postCssConfig = exports.typescript = exports.tmpTypescryptConfigPath = exports.tmpTypescryptConfigDir = exports.css = exports.serverWasRunDetectString = exports.engines = exports.dependencies = exports.babelEnvServer = exports.filenameServer = exports.outputServer = exports.publicDirName = exports.entryServer = exports.babelEnvSpa = exports.env = exports.socket = exports.protocol = exports.port = exports.host = exports.proxy = exports.browserslist = exports.devServer = exports.stats = exports.modules = exports.output = exports.entry = exports.context = exports.isRHL = exports.isTS = exports.isInferno = exports.isBrovserSync = exports.isRelay = exports.isIsomorphic = exports.isMobx = exports.isAnalyze = exports.isVerbose = exports.isDebug = exports.isProduction = exports.isDevelopment = exports.getProjectAbsPath = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _getConfig = require('./utils/getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CWD = process.cwd();
const getProjectAbsPath = exports.getProjectAbsPath = relPath => {
  if (relPath) {
    return _path2.default.resolve(CWD, relPath);
  }

  return '';
};
const config = (0, _getConfig2.default)();
//console.log(JSON.stringify(config, null, 2));
const additionalModules = config.modules.map(relPath => getProjectAbsPath(relPath));

const isDevelopment = exports.isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = exports.isProduction = process.env.NODE_ENV === 'production';
const isDebug = exports.isDebug = process.env.WEBPACK_DEBUG === 'true';
const isVerbose = exports.isVerbose = process.env.BUILD_TOOLS_VERBOSE === 'true';
const isAnalyze = exports.isAnalyze = process.env.BUILD_TOOLS_ANALYZE === 'true';
const isMobx = exports.isMobx = process.env.ENABLED_MOBX_TOOLS === 'true';
const isIsomorphic = exports.isIsomorphic = process.env.ENABLED_ISOMORPHIC === 'true';
const isRelay = exports.isRelay = process.env.ENABLED_RELAY === 'true';
const isBrovserSync = exports.isBrovserSync = process.env.ENABLED_BROWSER_SYNC === 'true';
const isInferno = exports.isInferno = process.env.INFERNOJS_SPA === 'true';
const isTS = exports.isTS = process.env.ENABLED_TYPE_SCRIPT === 'true';
const isRHL = exports.isRHL = process.env.ENABLED_RHL === 'true';

const filename = isDevelopment ? '[name].js?[hash:4]' : '[chunkhash:32].js';
const chunkFilename = isDevelopment ? '[name].chunk.js?[hash:4]' : '[chunkhash:32].chunk.js';
const _publicDirName = config.isomorphic.publicDirName;
const outputPublicPath = getProjectAbsPath(isIsomorphic ? `${config.output.path}/${_publicDirName}` : config.output.path);
const outputProtectPath = getProjectAbsPath(config.output.path);

const context = exports.context = getProjectAbsPath(config.context);
const entry = exports.entry = config.entry;
const output = exports.output = {
  path: outputPublicPath,
  publicPath: config.output.publicPath,
  filename,
  chunkFilename,
  pathinfo: isVerbose || isDebug
};
const modules = exports.modules = ['node_modules', ...additionalModules];
const stats = exports.stats = {
  colors: true,
  timings: true,
  context,
  modules: isVerbose,
  maxModules: isDebug ? 100000 : 10,
  reasons: isVerbose,
  hash: isVerbose,
  version: isVerbose,
  chunks: isVerbose,
  chunkModules: isVerbose,
  cached: isVerbose,
  cachedAssets: isVerbose
};
const devServer = exports.devServer = {
  publicPath: output.publicPath,
  contentBase: outputPublicPath,
  stats
};
const browserslist = exports.browserslist = config.browserslist;
const proxy = exports.proxy = config.proxy;
const host = exports.host = config.socket.host;
const port = exports.port = config.socket.port;
const protocol = exports.protocol = 'http';
const socket = exports.socket = `${protocol}://${host}:${port}`;
const env = exports.env = {
  NODE_ENV: isDevelopment ? '"development"' : '"production"',
  DEBUG: isDebug,
  __DEV__: isDevelopment,
  __PROD__: isProduction,
  __RHL__: isRHL
};
// A Babel preset that can automatically determine the Babel plugins and polyfills
// https://github.com/babel/babel-preset-env
const babelEnvSpa = exports.babelEnvSpa = ['env', {
  targets: {
    browsers: browserslist
  },
  modules: false,
  useBuiltIns: false,
  debug: isDebug
}];

// For server build in isomorphic mode
const entryServer = exports.entryServer = config.isomorphic.entry;
const publicDirName = exports.publicDirName = _publicDirName;
const outputServer = exports.outputServer = outputProtectPath;
const filenameServer = exports.filenameServer = `../${entryServer}`;
const babelEnvServer = exports.babelEnvServer = ['env', {
  targets: {
    node: config.nodeVersion
  },
  modules: false,
  useBuiltIns: false,
  debug: false
}];
const dependencies = exports.dependencies = config.dependencies;
const engines = exports.engines = config.engines;
const serverWasRunDetectString = exports.serverWasRunDetectString = `The server is running at ${socket}`;

const postCssPluginsFile = getProjectAbsPath(config.css.postCssPlugins);
const postCssPlugins = _fs2.default.existsSync(postCssPluginsFile) ? require(postCssPluginsFile) : [];

const css = exports.css = {
  isolation: config.css.isolation,
  reset: config.css.reset,
  postCssPlugins: Array.isArray(postCssPlugins) ? postCssPlugins : []
};
const tmpTypescryptConfigDir = exports.tmpTypescryptConfigDir = _path2.default.resolve(__dirname, '../../tmp');
const tmpTypescryptConfigPath = exports.tmpTypescryptConfigPath = _path2.default.resolve(__dirname, '../../tmp/tsconfig.json');
const typescript = exports.typescript = config.typescript;
const postCssConfig = exports.postCssConfig = require(_path2.default.resolve(__dirname, 'postcss.config.js'));
//# sourceMappingURL=prepare.build-tools.config.js.map