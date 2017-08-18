import * as fs from 'fs';
import * as path from 'path';
import source from './source';

export const resolveNodeModules = (packageName = '') => path.resolve(process.env.REARGUARD_NODE_MODULE_PATH, packageName);
export const resolveTarget = (relPath = '') => path.resolve(CWD, relPath);

const CWD = process.cwd();
const config = source();

/**
 * ENV
 * */
export const isDevelopment = config.isDevelopment;
export const isDebug = config.isDebug;
export const isVerbose = config.isVerbose;
export const isAnalyze = config.isAnalyze;
export const isIsomorphic = config.isIsomorphic;
export const isInferno = config.isInferno;
export const isReact = config.isReact;
export const isTS = config.isTS;
export const onlyServer = config.onlyServer;
/**
 * End
 * */
/**
 * General
 * */
export const publicDirName = config.isomorphic.publicDirName;
export const isOldNode = config.nodeVersion <= 8;
export const isVeryOldNode = config.nodeVersion < 6;
const clientOutput = resolveTarget(isIsomorphic? `${config.output.path}/${publicDirName}`: config.output.path);
/**
 * End
 * */

/**
 * Socket
 * */
export const host = config.socket.host;
export const port = config.socket.port;
export const protocol = 'http';
export const socket = `${protocol}://${host}:${port}`;
/**
 * End
 * */

/**
 * Webpack
 * */
export const context = resolveTarget(config.context);
export const entry = config.entry;
export const output = {
  path: clientOutput,
  publicPath: config.output.publicPath,
  filename: isDevelopment ? '[name].js?[hash:4]' : '[chunkhash:32].js',
  chunkFilename: isDevelopment ? '[name].chunk.js?[hash:4]' : '[chunkhash:32].chunk.js',
  pathinfo: isVerbose || isDebug,
};
export const modules = [
  ...config.modules.map(relPath => resolveTarget(relPath)),
  'node_modules',
  resolveNodeModules()
];
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
  contentBase: clientOutput,
  stats,
  proxy,
};
/**
 * End
 * */

/**
 * Plugins
 * */
export const browserslist = config.browserslist;
export const env = {
  NODE_ENV: isDevelopment ? '"development"' : '"production"',
  DEBUG: isDebug,
  __DEV__: isDevelopment,
};
// A Babel preset that can automatically determine the Babel plugins and polyfills
// https://github.com/babel/babel-preset-env
const babelEnv = (targets: any) => ([
  resolveNodeModules('babel-preset-env'),
  {
    targets,
    modules: false,
    useBuiltIns: false,
    debug: isDebug,
  }
]);

export const babelEnvSpa = babelEnv({ browsers: browserslist });
export const babelEnvServer = babelEnv({ node: config.nodeVersion });
/**
 * End
 * */

/**
 * Package.json
 * */
export const dependencies = config.dependencies;
export const engines = config.engines;
/**
 * End
 * */

/**
 * Isomorphic
 * */
export const serverEntry = config.isomorphic.entry;
export const servercOutput = resolveTarget(config.output.path);
export const serverFilename = `../${serverEntry}`;
export const serverWasRunDetectString = `The server is running at ${socket}`;
/**
 * End
 * */

/**
 * CSS
 * */
const postCssPluginsFile = resolveTarget(config.css.postCssPlugins);
const postCssPlugins = fs.existsSync(postCssPluginsFile) ? require(postCssPluginsFile) : [];

export const css = {
  isolation: config.css.isolation,
  reset: config.css.reset,
  postCssPlugins: Array.isArray(postCssPlugins) ? postCssPlugins : [],
};


export const postCSSConfigPath = require(path.resolve(__dirname, 'postcss.config.js'));
/**
 * End
 * */

/**
 * Typescript
 * */
export const typescriptTMP = path.resolve(__dirname, '../../tmp');
export const typescriptConfigFilePath = path.resolve(__dirname, '../../tmp/tsconfig.json');
export const typescript = config.typescript;
/**
 * End
 * */
