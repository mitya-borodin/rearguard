import * as fs from "fs";
import * as path from "path";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import source from "./source";

const CWD = process.cwd();
const config = source();

export const resolveNodeModules = (name: string = "") => path.resolve(process.env.REARGUARD_NODE_MODULE_PATH || "", name);
export const resolveTarget = (relPath: string = "") => path.resolve(CWD, relPath);

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
export const root: string = resolveTarget();
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
export const stats: webpack.Options.Stats = isDebug
  ? "verbose"
  : {
    assets: true,
    colors: true,
    context,
    hash: true,
    modules: false,
    performance: false,
    publicPath: true,
    timings: true,
    version: true,
  };
export const proxy = config.proxy;
export const WDSConfig: WDS.Configuration = {
  bonjour: true,
  compress: true,
  contentBase: resolveTarget(path.resolve(root, "dll", isDevelopment ? "dev" : "prod")),
  historyApiFallback: true,
  hot: true,
  https: true,
  open: true,
  overlay: false,
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
export const ts = config.typescript.config;
export const tsConfigPath = resolveTarget(config.typescript.configPath);
export const tsLintConfigPath = resolveTarget("tslint.json");
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

// DLL
/* tslint:disable */
export const dll_path = path.resolve(path.join(root, "dll", isDevelopment ? "dev" : "prod"));
export const dll_manifest_name = "vendor-manifest.json";
export const dll_assets_name = "vendor-hash.json";
export const dll_manifest_path = path.resolve(dll_path, dll_manifest_name);
export const dll_assets_path = path.join(dll_path, dll_assets_name);
export const dll_lib_name = "dll_vendor";
export const dll_lib_file_name = "dll.vendor.[hash].js";
export const dll_lib_output_path = path.join(root, "dll", isDevelopment ? "dev" : "prod");
export const dll_entry_name = "vendors";
/* tslint:enable */
// END
