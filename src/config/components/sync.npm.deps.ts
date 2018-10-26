import { getErrorMessage, isString, isUndefined } from "@borodindmitriy/utils";
import chalk from "chalk";
// import * as chokidar from "chokidar";
// import { FSWatcher } from "chokidar";
import * as copy from "copy";
import * as del from "del";
import * as fs from "fs";
import { snakeCase } from "lodash";
import * as mkdirp from "mkdirp";
import * as moment from "moment";
import * as path from "path";
import * as semver from "semver";
import {
  bundle_sub_dir,
  dll_bundle_dirname,
  dll_manifest_name,
  isDebug,
  lib_bundle_dirname,
  resolveGlobalNodeModules,
  resolveLocalNodeModules,
  root,
  sync_npm_deps as dep_list,
} from "./target.config";
// tslint:disable:variable-name object-literal-sort-keys

export interface ICopyInfo {
  module_name: string;
  files: string[];
  version: string;
}

export interface IInfo {
  name: string;
  bundle_name: string;
  manifest: string;
  isDLL: boolean;
  isLibrary: boolean;
  isProject: boolean;
}

const copy_info: ICopyInfo[] = [];
const info: IInfo[] = [];
// const watchers: FSWatcher[] = [];

export function get_sync_npm_modules_info(): IInfo[] {
  return info;
}

export async function sync_npm_deps(watch: boolean = true) {
  console.log(chalk.bold.blue(`==============SYNC_NPM_DEPS============`));
  const startTime = moment();
  console.log(chalk.bold.blue(`[ SYNC_NPM_DEPS ][ RUN ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log("");

  try {
    if (dep_list.length > 0) {
      console.log(chalk.bold.white(`[ SYNC_NPM_DEPS ][ LIST ][ ${dep_list.join(", ")} ]`));
      console.log("");

      const LOCAL_NODE_MODULES = path.resolve(root, "node_modules");
      const LOCAL_PKG_PATH = path.resolve(root, "package.json");

      // Проверка текущего package.json
      if (fs.existsSync(LOCAL_PKG_PATH)) {
        const LOCAL_PKG = require(LOCAL_PKG_PATH);
        // modules_path - пути до модулей.
        const global_modules_path: Array<{ module_name: string; module_path: string }> = [];

        // Проверка на существование модулей;
        // А так же составление списка модулей;
        for (const name of dep_list) {
          const global_path = resolveGlobalNodeModules(name);
          const local_path = resolveLocalNodeModules(name);

          if (fs.existsSync(global_path)) {
            console.log(chalk.white(`[ SYNC_NPM_DEPS ][ WAS_USE ][ GLOBAL_MODULE: ${local_path} ]`));

            global_modules_path.push({ module_name: name, module_path: global_path });
          } else if (fs.existsSync(local_path)) {
            // Внимание, modules_path - в этот список необходимо добавлять только глобально слинкованные модули.
            // Так как существует ситуация когда зависимости устанавдиваются локально, и не разрабатываются.
            console.log(chalk.bold.yellow(`[ SYNC_NPM_DEPS ][ WAS_USE ][ LOCAL_MODULE: ${local_path} ]`));
          } else {
            console.log(
              chalk.red(
                `[ SYNC_NPM_DEPS ][ ERROR ][ You haven't link in global node_modules ${global_path} or local node_modules ${local_path} ]`,
              ),
            );
            console.log(
              chalk.red(
                `[ SYNC_NPM_DEPS ][ ERROR ][ You need go to the project and do [ npm link || npm install ] needs module ]`,
              ),
            );

            process.exit(1);
          }
        }

        // END

        // SETTINGS
        for (const { module_name, module_path } of global_modules_path) {
          const pkg_path = path.resolve(module_path, "package.json");

          if (fs.existsSync(pkg_path)) {
            // COPY_SETTINGS
            const data_copy_info: ICopyInfo = {
              module_name,
              files: [pkg_path],
              version: "",
            };

            const { version, files } = require(pkg_path);

            for (const file of files) {
              const file_path = path.resolve(module_path, file);

              if (fs.existsSync(file_path)) {
                data_copy_info.files.push(`${file_path}/**`);
              }
            }

            data_copy_info.version = version;

            copy_info.push(data_copy_info);
            // END
          } else {
            console.log(chalk.red(`[ SYNC_NPM_DEPS ][ SETTINGS ][ ERROR ][ NOT_FOUND: ${pkg_path} ]`));

            process.exit(1);
          }
        }
        // END

        // Удаляю существующие пакеты из локального node_modules и создаю пустые директории для новых файлов;
        // Удаляются только те, которые слинкованны на глобальный node_modules, то есть которые разрабатываются
        // вместе с проектом;
        const LOCAL_MODULES = dep_list
          .filter((name: string) => {
            for (const { module_name } of global_modules_path) {
              if (module_name === name) {
                return true;
              }
            }

            return false;
          })
          .map((name: string) => path.resolve(LOCAL_NODE_MODULES, name));

        for (const module_path of LOCAL_MODULES) {
          await new Promise((resolve, reject) => {
            if (fs.existsSync(module_path)) {
              del(module_path).then((paths) => {
                for (const item of paths) {
                  console.log(chalk.magenta("[ SYNC_NPM_DEPS ][ MODULE ][ REMOVE ]"), chalk.magenta(item));
                }
                mkdirp(module_path, (error) => {
                  if (error) {
                    console.error(error);
                    reject();
                  } else {
                    console.log(
                      chalk.green("[ SYNC_NPM_DEPS ][ MODULE ][ CREATED ][ DIR ]", chalk.green(`${module_path}`)),
                    );

                    resolve();
                  }
                });
              });
            } else {
              mkdirp(module_path, (error) => {
                if (error) {
                  console.error(error);
                  reject();
                } else {
                  console.log(
                    chalk.green("[ SYNC_NPM_DEPS ][ MODULE ][ CREATED ][ DIR ]", chalk.green(`${module_path}`)),
                  );

                  resolve();
                }
              });
            }
          });
        }
        // END

        // Копирование пакетов в локальный node_modules;
        for (const { module_name, files, version } of copy_info) {
          await new Promise((resolve, reject) => {
            copy(files, path.resolve(LOCAL_NODE_MODULES, module_name), (error: any, items: any[]) => {
              if (!error) {
                if (isDebug) {
                  for (const item of items) {
                    console.log(
                      chalk.bold.cyan(`[ SYNC_NPM_DEPS ][ MODULE ][ COPY ][ ${module_name} ]`),
                      chalk.bold.cyan(item.path),
                    );
                  }
                } else {
                  console.log(
                    chalk.bold.cyan(`[ SYNC_NPM_DEPS ][ MODULE ][ COPY ][ ${module_name} ]`),
                    chalk.bold.cyan(`[ ${items.length} FILES ]`),
                  );
                }

                resolve();
              } else {
                reject(error);
              }
            });
          });

          for (const dep_type of ["dependencies", "devDependencies", "peerDependencies"]) {
            if (!isUndefined(LOCAL_PKG[dep_type]) && isString(LOCAL_PKG[dep_type][module_name])) {
              if (semver.valid(LOCAL_PKG[dep_type][module_name])) {
                LOCAL_PKG[dep_type][module_name] = version;
              }
            }
          }
        }

        // Обновляем локальный package.json
        fs.writeFileSync(LOCAL_PKG_PATH, JSON.stringify(LOCAL_PKG, null, 2), {
          encoding: "utf-8",
        });

        console.log("");
        // END

        // Копирование dll_bundle и lib_bundle из локального node_modules;
        async function copy_bundle(module_path: string, bundle_dirname: string, name: string) {
          const snake_name = snakeCase(name);
          const bundle = path.resolve(module_path, bundle_dirname, snake_name);
          const local_bundle = path.resolve(root, bundle_dirname, snake_name);

          // Если существует директория конкретного бандла, то удаляем её и после чего создаем заново.
          // Если директория бандла не существует, то создаем её.
          await new Promise((resolve, reject) => {
            if (fs.existsSync(bundle)) {
              if (fs.existsSync(local_bundle)) {
                del(local_bundle)
                  .then((paths) => {
                    for (const item of paths) {
                      console.log(
                        chalk.magenta(`[ SYNC_NPM_DEPS ][ BUNDLE ][ REMOVE ][ ${name} ]`),
                        chalk.magenta(item),
                      );
                    }

                    mkdirp(local_bundle, (error) => {
                      if (error) {
                        reject(error);
                      } else {
                        console.log(
                          chalk.green(
                            `[ SYNC_NPM_DEPS ][ BUNDLE ][ CREATED ][ DIR ][ ${name} ]`,
                            chalk.green(local_bundle),
                          ),
                        );
                        resolve();
                      }
                    });
                  })
                  .catch((error) => {
                    reject(error);
                  });
              } else {
                mkdirp(local_bundle, (error) => {
                  if (error) {
                    reject(error);
                  } else {
                    console.log(
                      chalk.green(
                        `[ SYNC_NPM_DEPS ][ BUNDLE ][ CREATED ][ DIR ][ ${name} ]`,
                        chalk.green(local_bundle),
                      ),
                    );

                    resolve();
                  }
                });
              }
            } else {
              del(local_bundle)
                .then((paths) => {
                  for (const item of paths) {
                    console.log(chalk.magenta(`[ SYNC_NPM_DEPS ][ BUNDLE ][ REMOVE ][ ${name} ]`), chalk.magenta(item));
                  }

                  resolve();
                })
                .catch(reject);
            }
          });
          if (fs.existsSync(bundle)) {
            await new Promise((resolve, reject) => {
              copy([`${bundle}/**`], local_bundle, (error: any, items: any[]) => {
                if (!error) {
                  if (isDebug) {
                    for (const item of items) {
                      console.log(
                        chalk.bold.cyan(`[ SYNC_NPM_DEPS ][ BUNDLE ][ COPY ][ ${name} ]`),
                        chalk.bold.cyan(item.path),
                      );
                    }
                  } else {
                    console.log(
                      chalk.bold.cyan(`[ SYNC_NPM_DEPS ][ BUNDLE ][ COPY ][ ${name} ]`),
                      chalk.bold.cyan(`[ ${items.length} FILES ]`),
                    );
                  }

                  resolve();
                } else {
                  reject(error);
                }
              });
            });
          }
        }

        // Внимание, в этом случае, необходимо перебирать указанные зависимости.
        // Так как все необходимые манипуляции с установкой пакетов проведены, и далее необходимо скопировать бандлы.
        for (const module_name of dep_list) {
          const module_path = path.resolve(LOCAL_NODE_MODULES, module_name);
          const pkg_path = path.resolve(module_path, "package.json");

          if (fs.existsSync(pkg_path)) {
            const { name, isDLL, isLibrary } = require(pkg_path);

            try {
              // Данный вариант необходим, когда у библиотеки есть собственный dll_bundle;
              if (isDLL || isLibrary) {
                await copy_bundle(module_path, dll_bundle_dirname, name);
              }

              if (isLibrary) {
                await copy_bundle(module_path, lib_bundle_dirname, name);
              }
            } catch (error) {
              console.log(chalk.red(`[ SYNC_NPM_DEPS ][ BUNDLE ][ COPY ][ ERROR_MESSAGE: ${getErrorMessage(error)} ]`));

              process.exit(1);
            }
          } else {
            console.log(chalk.red(`[ SYNC_NPM_DEPS ][ BUNDLE ][ COPY ][ ERROR ][ NOT_FOUND: ${pkg_path} ]`));

            process.exit(1);
          }
        }

        console.log("");
        // END

        // Составление информации о, подключенных dll_bundle, lib_bundle.
        // Для того, чтобы правильно применить DllReferencePlugin, а так же составления externals;
        for (const module_name of dep_list) {
          const module_path = path.resolve(LOCAL_NODE_MODULES, module_name);
          const pkg_path = path.resolve(module_path, "package.json");

          if (fs.existsSync(pkg_path)) {
            const { name, isDLL, isLibrary, isProject } = require(pkg_path);
            const snake_name = snakeCase(name);

            if (isDLL) {
              const manifest = path.resolve(root, dll_bundle_dirname, snake_name, bundle_sub_dir, dll_manifest_name);

              if (fs.existsSync(manifest)) {
                info.push({ name, bundle_name: `dll_${snake_name}`, manifest, isDLL, isLibrary, isProject });
              } else {
                console.log(
                  chalk.red(`[ SYNC_NPM_DEPS ][ BUNDLE ][ MAKE_INFO ][ ERROR ][ MANIFEST_NOT_FOUND: ${manifest} ]`),
                );

                process.exit(1);
              }
            }

            if (isLibrary) {
              info.push({ name, bundle_name: `lib_${snake_name}`, manifest: "", isDLL, isLibrary, isProject });
            }
          } else {
            console.log(chalk.red(`[ SYNC_NPM_DEPS ][ BUNDLE ][ MAKE_INFO ][ ERROR ][ NOT_FOUND: ${pkg_path} ]`));

            process.exit(1);
          }
        }
        // END

        /*     // WATCH секция.
      try {
        if (watch) {
          console.log(chalk.blue("[ WATCH_INIT ]"));

          if (watchers.length > 0) {
            for (const watcher of watchers) {
              watcher.close();
            }
          }

          for (const { moduleName, paths } of npmHardSyncCopyTarget) {
            const watcher = chokidar.watch(paths);

            watcher.on("change", (from) => {
              const insidePath = from.substr(from.indexOf(moduleName) + moduleName.length + 1, from.length);
              const to = path.resolve(LOCAL_NODE_MODULES, moduleName, insidePath);

              fs.unlinkSync(to);
              if (isDebug) {
                console.log(chalk.blue("[ REMOVED_LOCAL_COPY ]"));
                console.log(chalk.blue(`[ OF: ${to} ]`));
                console.log("");
              }

              fs.copyFileSync(from, to);
              if (isDebug) {
                console.log(chalk.blue(`[ COPY ][ ${moduleName} ]`));
                console.log(chalk.blue(`[ FROM: ${from} ]`));
                console.log(chalk.blue(`[ TO ${to} ]`));
                console.log("");
              }
              if (!isDebug) {
                console.log(chalk.blue(`[ SYNC_NPM ][ UPDATE ][ ${insidePath} ]`));
                console.log("");
              }
            });

            watchers.push(watcher);
          }
        }
      } catch (error) {
        console.error(error);
        console.log(chalk.red(`[ SYNC_NPM ][ ERROR_MESSAGE: ${error.message} ]`));
        console.log(chalk.blue(`[ SYNC_NPM ][ WILL_RESTARTED_TROUGHT 1000ms; ]`));
        console.log("");

        setTimeout(sync_npm_deps, 1000);
      } */
      } else {
        console.log(chalk.red("[ SYNC_NPM_DEPS ][ ERROR ][ package.json IS_NOT_EXIST ]"));
        console.log("");

        process.exit(1);
      }
    } else {
      console.log(chalk.bold.white("[ SYNC_NPM_DEPS ][ LIST IS EMPTY ]"));
      console.log("");
    }

    const endTime = moment();

    console.log(
      chalk.bold.blue(`[ SYNC_NPM_DEPS ][ WORK_TIME ][ ${endTime.diff(startTime, "milliseconds")} ][ millisecond ]`),
    );
    console.log(chalk.bold.blue(`[ SYNC_NPM_DEPS ][ DONE ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
    console.log(chalk.bold.blue(`=======================================`));
    console.log("");
  } catch (error) {
    console.trace(chalk.red(`[ SYNC_NPM_DEPS ][ ERROR_MESSAGE: ${getErrorMessage(error)} ]`));

    process.exit(1);
  }
}
// tslint:enable:variable-name
