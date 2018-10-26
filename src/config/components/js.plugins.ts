import chalk from "chalk";
import * as CleanWebpackPlugin from "clean-webpack-plugin";
import * as fs from "fs";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as TerserPlugin from "terser-webpack-plugin";
import * as webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import * as WorkboxPlugin from "workbox-webpack-plugin";
import { get_sync_npm_modules_info, IInfo } from "./sync.npm.deps";
import {
  analyze as configAnalyze,
  context,
  dll_assets_path,
  dll_entry_name,
  dll_manifest_path,
  dll_path,
  isBuild,
  isDebug,
  isDevelopment,
  isLib,
  output,
  root,
} from "./target.config";

export const HMR = (): webpack.Plugin[] => {
  if (isDevelopment && !isLib) {
    return [
      new webpack.NamedModulesPlugin(),
      // prints more readable module names in the browser console on HMR updates

      new webpack.HotModuleReplacementPlugin(),
      // enable HMR globally
    ];
  }

  return [];
};

export const uglify = (): webpack.Plugin[] => {
  if (!isDevelopment) {
    return [
      // https://github.com/webpack-contrib/terser-webpack-plugin
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          compress: {
            sequences: true,
            unused: true,
          },
          ecma: 8,
        },
      }),
    ];
  }

  return [];
};

// Webpack Bundle Analyzer
// https://github.com/th0r/webpack-bundle-analyzer
export const analyze = (): webpack.Plugin[] => {
  if (isDebug) {
    return [
      new BundleAnalyzerPlugin({
        analyzerPort: configAnalyze.port,
      }),
    ];
  }

  return [];
};

export const htmlWebpackPlugin = (dll = true): webpack.Plugin[] => {
  if (!isLib && !isBuild) {
    // Необходим для:
    // 1) Режим разработки, так как для WDS необходим index.html.
    // 2) Сборка продакшн решения, так как для WEB сервера необходим index.html;
    // Откуда берутся данные для заполнения макета:
    // 1) Из текущих entry -> htmlWebpackPlugin.files;
    // 2) Из подклёченных dll_bundle и library_bundle;
    // Когда появляется информация о файлах:
    // 1) Перед запуском webpack выполняется подготовка, проверяется список sync_npm_deps;
    // 2) Ищутся пакеты, из пакетов вытаскиваются файлы, анализируются файлы и JS файлы,
    //    составляются в таком порядке в каком указаны sync_npm_deps;
    // 3) Все готовую информацию подключают как script;
    // 4) Существуют пакеты которые подключаются из приложения, они не участвуют в этом списке.
    // TODO: 1) Получить подготовленные данные
    let dllConfig = { [dll_entry_name]: {} };

    if (dll && fs.existsSync(dll_assets_path)) {
      dllConfig = require(dll_assets_path);
    }

    return [
      new HtmlWebpackPlugin({
        dllConfig,
        filename: "index.html",
        inject: false,
        template: path.resolve(__dirname, "../../../../templates/html-webpack-template.ejs"),
      }),
    ];
  }

  return [];
};

export const DllPlugin = (): webpack.Plugin[] => {
  return [
    ...clean([dll_path], true),
    new webpack.DllPlugin({
      context,
      name: dll_entry_name,
      path: dll_manifest_path,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(false),
  ];
};

export const DllReferencePlugin = (): webpack.Plugin[] => {
  const info: IInfo[] = get_sync_npm_modules_info();
  const plugins: webpack.Plugin[] = [];

  for (const { bundle_name, isDLL, manifest } of info) {
    if (isDLL && path.isAbsolute(manifest)) {
      if (fs.existsSync(manifest)) {
        plugins.push(
          new webpack.DllReferencePlugin({
            context,
            manifest,
            name: bundle_name,
          }),
        );
      } else {
        console.log(chalk.red(`[ DllReferencePlugin ][ ERROR ][ MANIFEST_NOT_FOUND: ${manifest} ]`));

        process.exit(1);
      }
    }
  }

  // Добавить возможность подключения плагинов для манифестов доступных в пакетах из списка include_npm_dll.
  if (fs.existsSync(dll_manifest_path)) {
    plugins.push(
      new webpack.DllReferencePlugin({
        context,
        manifest: dll_manifest_path,
        name: dll_entry_name,
      }),
    );
  }

  return plugins;
};

export const workboxPlugin = (): webpack.Plugin[] => {
  if (isBuild) {
    console.log(output.path);

    return [
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        globDirectory: output.path,
        globPatterns: ["*.{js,html,jpeg,jpg,svg,gif,png,ttf}"],
        importWorkboxFrom: "local",
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        navigateFallback: "/",
        skipWaiting: true,
        swDest: "sw.js",
      }),
    ];
  }

  return [];
};

export const clean = (toRemove: string[] = [], force = false): webpack.Plugin[] => {
  if (!isDevelopment || force || isBuild) {
    return [new CleanWebpackPlugin(toRemove, { root, verbose: isDebug })];
  }

  return [];
};
