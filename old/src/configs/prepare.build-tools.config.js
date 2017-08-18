import fs from 'fs';
import path from 'path';
import getConfig from './utils/getConfig';
import resolveBuildToolsModules from './utils/resolveBuildToolsModules';

const CWD = process.cwd();
export const getProjectAbsPath = (relPath) => {
  if (relPath) {
    return path.resolve(CWD, relPath);
  }

  return '';
};
const config = getConfig();

const additionalModules = config.modules.map(relPath => getProjectAbsPath(relPath));

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isDebug = process.env.WEBPACK_DEBUG === 'true';
export const isVerbose = process.env.BUILD_TOOLS_VERBOSE === 'true';
export const isAnalyze = process.env.BUILD_TOOLS_ANALYZE === 'true';
export const isIsomorphic = process.env.ENABLED_ISOMORPHIC === 'true';
export const isInferno = process.env.REARGUARD_INFERNO_JS === 'true';
export const isReact = process.env.REARGUARD_REACT === 'true';
export const isTS = process.env.ENABLED_TYPE_SCRIPT === 'true';
export const onlyServer = process.env.ONLY_SERVER === 'true';
export const isOldNode = config.nodeVersion <= 8;
export const isVeryOldNode = config.nodeVersion < 6;

const filename = isDevelopment ? '[name].js?[hash:4]' : '[chunkhash:32].js';
const chunkFilename = isDevelopment ? '[name].chunk.js?[hash:4]' : '[chunkhash:32].chunk.js';
const _publicDirName = config.isomorphic.publicDirName;
const outputPublicPath = getProjectAbsPath(
  isIsomorphic ? `${config.output.path}/${_publicDirName}` : config.output.path,
);
const outputProtectPath = getProjectAbsPath(config.output.path);

export const context = getProjectAbsPath(config.context);
export const entry = config.entry;
export const output = {
  path: outputPublicPath,
  publicPath: config.output.publicPath,
  filename,
  chunkFilename,
  pathinfo: isVerbose || isDebug,
};

export const modules = [...additionalModules, 'node_modules', resolveBuildToolsModules()];
export const stats = {
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
  cachedAssets: isVerbose,
};
export const proxy = config.proxy;
export const devServer = {
  publicPath: output.publicPath,
  contentBase: outputPublicPath,
  stats,
  proxy,
};
export const browserslist = config.browserslist;
export const host = config.socket.host;
export const port = config.socket.port;
export const protocol = 'http';
export const socket = `${protocol}://${host}:${port}`;
export const env = {
  NODE_ENV: isDevelopment ? '"development"' : '"production"',
  DEBUG: isDebug,
  __DEV__: isDevelopment,
  __PROD__: isProduction,
};
// A Babel preset that can automatically determine the Babel plugins and polyfills
// https://github.com/babel/babel-preset-env
export const babelEnvSpa = [
  resolveBuildToolsModules('babel-preset-env'),
  {
    targets: {
      browsers: browserslist,
    },
    modules: false,
    useBuiltIns: false,
    debug: isDebug,
  },
];



// For server build in isomorphic mode
export const entryServer = config.isomorphic.entry;
export const publicDirName = _publicDirName;
export const outputServer = outputProtectPath;
export const filenameServer = `../${entryServer}`;
export const babelEnvServer = [
  resolveBuildToolsModules('babel-preset-env'),
  {
    targets: {
      node: config.nodeVersion,
    },
    modules: false,
    useBuiltIns: false,
    debug: isDebug,
  },
];
export const dependencies = config.dependencies;
export const engines = config.engines;
export const serverWasRunDetectString = `The server is running at ${socket}`;

const postCssPluginsFile = getProjectAbsPath(config.css.postCssPlugins);
const postCssPlugins = fs.existsSync(postCssPluginsFile) ? require(postCssPluginsFile) : [];

export const css = {
  isolation: config.css.isolation,
  reset: config.css.reset,
  postCssPlugins: Array.isArray(postCssPlugins) ? postCssPlugins : [],
};
export const tmpTypescryptConfigDir = path.resolve(__dirname, '../../tmp');
export const tmpTypescryptConfigPath = path.resolve(__dirname, '../../tmp/tsconfig.json');
export const typescript = config.typescript;
export const postCssConfig = require(path.resolve(__dirname, 'postcss.config.js'));
