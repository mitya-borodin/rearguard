import * as fs from "fs";
import * as path from "path";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import source from "./source";

export const resolveNodeModules = (packageName = "") => path.resolve(
  process.env.REARGUARD_NODE_MODULE_PATH,
  packageName,
);
export const resolveTarget = (relPath = "") => path.resolve(CWD, relPath);

const CWD = process.cwd();
const config = source();

// ENV
export const isDevelopment = config.isDevelopment;
export const isDebug = config.isDebug;
export const isVerbose = config.isVerbose;
export const isAnalyze = config.isAnalyze;
export const isIsomorphic = config.isIsomorphic;
export const isInferno = config.isInferno;
export const isReact = config.isReact;
export const isTS = config.isTS;
export const isStart = config.isStart;
export const isBuild = config.isBuild;
export const onlyServer = config.onlyServer;
export const staticServer = config.staticServer;
// END

// General
export const publicDirName = config.isomorphic.publicDirName;
export const isOldNode = config.nodeVersion < 8;
export const isVeryOldNode = config.nodeVersion < 6;
const clientOutput = resolveTarget(isIsomorphic || staticServer ? `${config.output.path}/${publicDirName}` : config.output.path);
// END

// Socket
export const host = config.socket.host;
export const port = config.socket.port;
process.env.HOST = host;
process.env.PORT = port;
export const protocol = "http";
export const socket = `${protocol}://${host}:${port}`;
// END

// Webpack
export const context = resolveTarget(config.context);
export const entry = config.entry;
export const output = {
  chunkFilename: isDevelopment ? "[name].chunk.js?[hash:4]" : "[chunkhash:32].chunk.js",
  filename: isDevelopment ? "[name].js?[hash:4]" : "[chunkhash:32].js",
  path: clientOutput,
  pathinfo: isVerbose || isDebug,
  publicPath: config.output.publicPath,
};
export const modules = [
  ...config.modules.map((relPath) => resolveTarget(relPath)),
  "node_modules",
  resolveNodeModules(),
];

export const stats: webpack.Options.Stats = {
  cached: isVerbose,
  chunkModules: isVerbose,
  chunks: isVerbose,
  colors: true,
  context,
  hash: isVerbose,
  modules: isVerbose,
  reasons: isVerbose,
  timings: true,
  version: isVerbose,
};
export const proxy: { [key: string]: any } = config.proxy;

export const webpackMiddlewareConfig: any = {
  publicPath: output.publicPath,
  stats,
  watchOptions: {
    ignored: /node_modules/,
  },
};

export const WDSConfig: WDS.Configuration = {
  compress: true,
  contentBase: clientOutput,
  historyApiFallback: true,
  hot: true,
  proxy,
  publicPath: output.publicPath,
  stats,
};
// END

// Plugins
export const browserslist = config.browserslist;
export const env = {
  DEBUG: isDebug,
  NODE_ENV: isDevelopment ? '"development"' : '"production"',
  __DEV__: isDevelopment,
};
// A Babel preset that can automatically determine the Babel plugins and polyfills
// https://github.com/babel/babel-preset-env
const babelEnv = (targets: any) => ([
  resolveNodeModules("babel-preset-env"),
  {
    debug: isDebug,
    modules: false,
    targets,
    useBuiltIns: false,
  },
]);

export const babelEnvSpa = babelEnv({browsers: browserslist});
export const babelEnvServer = babelEnv({node: config.nodeVersion >= 6 ? 6 : config.nodeVersion});
// END

// Package.json
export const dependencies = config.dependencies;
export const engines = config.engines;
// END

// Isomorphic
export const serverEntry = config.isomorphic.entry;
export const servercOutput = resolveTarget(config.output.path);
export const serverFilename = `../${serverEntry}`;
process.env.SERVER_LAUNCH_MESSAGE = `The server is running at ${socket}`;
// END

// CSS
const postCssPluginsFile = resolveTarget(config.css.postCssPlugins);
const postCssPlugins = fs.existsSync(postCssPluginsFile) ? require(postCssPluginsFile) : [];

export const css = {
  postCssPlugins: Array.isArray(postCssPlugins) ? postCssPlugins : [],
};

export const postCSSConfigPath = require(path.resolve(__dirname, "postcss.config.js"));
// END

// Typescript
export const typescriptTMP = path.resolve(__dirname, "../../tmp");
export const typescriptConfigFilePath = path.resolve(__dirname, "../../tmp/tsconfig.json");
export const typescript = config.typescript;
// END
