"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const source_1 = require("./source");
const CWD = process.cwd();
const config = source_1.default();
exports.resolveNodeModules = (name = "") => path.resolve(process.env.REARGUARD_NODE_MODULE_PATH, name);
exports.resolveTarget = (relPath = "") => path.resolve(CWD, relPath);
exports.isDevelopment = config.isDevelopment;
exports.isDebug = config.isDebug;
exports.isStart = config.isStart;
exports.isBuild = config.isBuild;
exports.nodeModulePath = config.nodeModulePath;
exports.socket = config.socket;
exports.root = exports.resolveTarget(`../${config.context}`);
exports.context = exports.resolveTarget(config.context);
exports.entry = config.entry;
exports.output = {
    chunkFilename: exports.isDevelopment ? "[name].chunk.js?[hash:8]" : "[chunkhash:32].chunk.js",
    filename: exports.isDevelopment ? "[name].js?[hash:8]" : "[chunkhash:32].js",
    path: exports.resolveTarget(config.output.path),
    pathinfo: exports.isDebug,
    publicPath: config.output.publicPath,
};
exports.modules = [
    ...config.modules.map((relPath) => exports.resolveTarget(relPath)),
    "node_modules",
    exports.resolveNodeModules(),
];
exports.stats = exports.isDebug ? "verbose" : "normal";
exports.proxy = config.proxy;
exports.WDSConfig = {
    bonjour: true,
    compress: true,
    contentBase: exports.resolveTarget(config.output.path),
    historyApiFallback: true,
    hot: true,
    https: true,
    open: true,
    overlay: true,
    proxy: exports.proxy,
    publicPath: exports.output.publicPath,
    stats: exports.stats,
};
exports.env = {
    NODE_ENV: exports.isDevelopment ? '"development"' : '"production"',
};
exports.analyze = {
    port: config.analyze.port,
};
exports.ts = {
    lint: path.resolve(__dirname, "../../tmp/tslint.json"),
    path: path.resolve(__dirname, "../../tmp/tsconfig.json"),
    props: config.typescript,
    tmp: path.resolve(__dirname, "../../tmp"),
};
const externalPluginsPath = exports.resolveTarget(config.postCSS.plugins);
exports.postCSS = {
    config: require(path.resolve(__dirname, "postcss.config.js")),
    plugins: {
        list: fs.existsSync(externalPluginsPath) ? require(externalPluginsPath) : [],
        path: externalPluginsPath,
    },
};
exports.pkg = {
    dependencies: config.dependencies,
    engines: config.engines,
    nodeVersion: config.nodeVersion,
};
//# sourceMappingURL=target.config.js.map