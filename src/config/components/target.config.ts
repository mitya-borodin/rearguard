import * as fs from "fs";
import * as path from "path";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import source from "../source/index";
const CWD = process.cwd();
const config = source();
// tslint:disable:variable-name object-literal-sort-keys

export const resolveGlobalNodeModules = (name: string = "") =>
  path.resolve(process.env.REARGUARD_GLOBAL_NODE_MODULES_PATH || "", name);
export const resolveNodeModules = (name: string = "") =>
  path.resolve(process.env.REARGUARD_NODE_MODULE_PATH || "", name);
export const resolveTarget = (relPath: string = "") =>
  path.resolve(CWD, relPath);

// ENV ===================================================================
export const isWDS = config.isWDS;
export const isSyncDeps = config.isSyncDeps;
export const isBuild = config.isBuild;
export const isDevelopment = config.isDevelopment;
export const isDebug = config.isDebug;
export const isLib = config.isLib;
export const isDll = config.isDll;
export const nodeModulePath = config.nodeModulePath;
// END

// GOBAL =================================================================
export const root: string = resolveTarget();
export const context: string = resolveTarget(config.context);
export const pkg = {
  dependencies: config.dependencies,
  engines: config.engines,
  name: config.name,
  nodeVersion: config.nodeVersion,
};
// sync_npm_deps - список зависимостей которые могут быть:
// 1) Слинкованны в глобальный node_modules;
// 2) Установлены в локальный node_modules;
// Список используется для:
// 1) Копирование по символической ссылке из глобального node_modules в локальный ( эммитация установки пакета )
// 2) Копирование dist/dll и dist/lib в локальный dist, для:
// 2.1) Разработки, чтобы составлять index.html файл.
// 2.1.1) Разработки, чтобы WDS подхватывал файлы.
// 2.2) Сборка, чтобы все зависимости были сложены в dist директорию, из которой в последствии nginx или
//      другой web server будет доставать файлы.
export const sync_npm_deps = config.sync_npm_deps;
// END

// LIB_BUNDLE =============================================================
// lib_entry - ts файл в котором описаны экспорты;
export const lib_entry = config.lib_entry;
// lib_name - название dll_bundle или lib_bundle, используется неявно и генерируется из название npm пакета.
// Поле name из package.json, приведенное к змеиной нотации;
export const lib_name = `lib_${pkg.name}`;
export const lib_file_name = `${lib_name}.[hash].js`;
export const lib_path = path.resolve(
  root,
  "lib_bundle",
  lib_name,
  isDevelopment ? "dev" : "prod",
);
// END ===================================================================

// DLL_BUNDLE ============================================================
// dll_entry - ts файл в котором описаны импорты;
export const dll_entry = config.dll_entry;
// dll_lib_name - глобальное название dll пакета, в рамках браузера;
export const dll_name = `dll_${lib_name}`;
export const dll_file_name = `${dll_name}.[hash].js`;
// dll_path - путь до директории в которую будут записаны фпайлы;
export const dll_path = path.resolve(
  root,
  "dll_bundle",
  lib_name,
  isDevelopment ? "dev" : "prod",
);
// dll_manifest_name - json файл описывает содержимое dll bundle, необходим для работы DLLReference;
export const dll_manifest_name = "manifest.json";
// dll_assets_name - описывает пути относительно своего местоположения, необходим для составления index.html;
export const dll_assets_name = "assets.json";
export const dll_manifest_path = path.resolve(dll_path, dll_manifest_name);
export const dll_assets_path = path.resolve(dll_path, dll_assets_name);
// END

// Socket ================================================================
export const socket = config.socket;
// END

// Webpack ===============================================================
const publicPath = path.normalize(
  isDll || isLib
    ? `${config.output.publicPath}/${pkg.name}/${
        isDevelopment ? "dev" : "prod"
      }`
    : config.output.publicPath,
);

let outputPath = resolveTarget(config.output.path);

if (isDll) {
  outputPath = dll_path;
}

if (isLib) {
  outputPath = lib_path;
}

export const entry: string = config.entry;
export const output: webpack.Output & { globalObject: string } = {
  // path - путь куда записываются файлы.
  path: outputPath,
  // filename - шаблон имен файлов.
  filename: isDevelopment ? "[name].js?[hash:8]" : "[chunkhash:32].js",
  // publicPath - путь до ресурса с файлами.
  publicPath,
  // Дописывает дополнительную информацию в bundle;
  pathinfo: isDebug,
  chunkFilename: isDevelopment
    ? "[name].chunk.js?[hash:8]"
    : "[chunkhash:32].chunk.js",
  // globalObject - непонятная хрень, после того, как все отлажу, то обязательно разберусь с этой настройкой.
  globalObject: "this",
};

export const modules: string[] = [
  ...config.modules.map((relPath) => resolveTarget(relPath)),
  resolveTarget("node_modules"),
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
  contentBase: [
    path.resolve(root, "dll_bundle"),
    path.resolve(root, "lib_bundle"),
  ],
  watchContentBase: true,
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

// Plugins ===============================================================
export const env = {
  NODE_ENV: JSON.stringify(isDevelopment ? "development" : "production"),
};
export const analyze = {
  port: config.analyze.port,
};
// END

// Typescript ============================================================
export const ts = config.typescript.config;
export const tsConfigPath = resolveTarget(config.typescript.configPath);
export const tsLintConfigPath = resolveTarget("tslint.json");
// END

// CSS ===================================================================
const externalPluginsPath = resolveTarget(config.postCSS.plugins);
export const postCSS = {
  config: require(path.resolve(__dirname, "postcss.config.js")),
  plugins: {
    list: fs.existsSync(externalPluginsPath)
      ? require(externalPluginsPath)
      : [],
    path: externalPluginsPath,
  },
};
// END
// tslint:enable:variable-name object-literal-sort-keys
