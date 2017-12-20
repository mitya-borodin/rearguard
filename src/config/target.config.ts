import * as fs from "fs";
import * as path from "path";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import source from "./source";

const CWD = process.cwd();
const config = source();

export const resolveNodeModules = (name = "") => path.resolve(process.env.REARGUARD_NODE_MODULE_PATH, name);
export const resolveTarget = (relPath = "") => path.resolve(CWD, relPath);

// ENV
export const isDevelopment = config.isDevelopment;
export const isDebug = config.isDebug;
export const isStart = config.isStart;
export const isBuild = config.isBuild;
export const nodeModulePath = config.nodeModulePath;
// END

// Socket
export const socket = config.socket;
// END

// Webpack
export const root: string = resolveTarget(`../${config.context}`);
export const context: string = resolveTarget(config.context);
export const entry: string = config.entry;
export const output: webpack.Output = {
  chunkFilename: isDevelopment ? "[name].chunk.js?[hash:8]" : "[chunkhash:32].chunk.js",
  filename: isDevelopment ? "[name].js?[hash:8]" : "[chunkhash:32].js",
  path: resolveTarget(config.output.path),
  pathinfo: isDebug,
  publicPath: config.output.publicPath,
};
export const modules: string[] = [
  ...config.modules.map((relPath) => resolveTarget(relPath)),
  "node_modules",
  resolveNodeModules(),
];
export const stats: webpack.Options.Stats = isDebug ? "verbose" : "normal";
export const proxy = config.proxy;
export const WDSConfig: WDS.Configuration = {
  bonjour: true,
  compress: true,
  contentBase: resolveTarget(config.output.path),
  historyApiFallback: true,
  hot: true,
  https: true,
  open: true,
  overlay: true,
  proxy,
  publicPath: output.publicPath,
  stats,
};
// END

// Plugins
export const env = {
  NODE_ENV: isDevelopment ? '"development"' : '"production"',
};
export const analyze = {
  port: config.analyze.port,
};
// END

// Typescript
export const ts = {
  lint: path.resolve(__dirname, "../../tmp/tslint.json"),
  path: path.resolve(__dirname, "../../tmp/tsconfig.json"),
  props: config.typescript,
  tmp: path.resolve(__dirname, "../../tmp"),
};
// END

// CSS
const externalPluginsPath = resolveTarget(config.postCSS.plugins);
export const postCSS = {
  config: require(path.resolve(__dirname, "postcss.config.js")),
  plugins: {
    list: fs.existsSync(externalPluginsPath) ? require(externalPluginsPath) : [],
    path: externalPluginsPath,
  },
};
// END

// Package.json
export const pkg = {
  dependencies: config.dependencies,
  engines: config.engines,
  nodeVersion: config.nodeVersion,
};
// END
