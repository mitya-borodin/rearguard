import { getErrorMessage, isString, isUndefined } from "@rtcts/utils";
import chalk from "chalk";
import * as copy from "copy";
import * as del from "del";
import { existsSync } from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as semver from "semver";
import { isArray } from "util";
import { rearguardConfig } from "../../config/rearguard";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";

// tslint:disable:variable-name

interface ICopyTask {
  version: string;
  name: string;
  files: string[];
}

export async function sync_with_linked_modules(envConfig: IEnvConfig): Promise<void> {
  try {
    const { sync_project_deps } = rearguardConfig;

    if (sync_project_deps.length > 0) {
      console.log(chalk.bold.blue(`==========SYNC_WITH_LINKED_MODULES==========`));
      console.log("");

      /////////////////////
      //
      // * START OF PROCEDURE
      //
      /////////////////////

      console.log(chalk.bold.white(`[ LIST ][ ${sync_project_deps.join(", ")} ]`));
      console.log("");

      const linked_modules: Array<{ name: string; path: string }> = [];
      const copyTasks: ICopyTask[] = [];

      /////////////////////
      //
      // * Проверка на существование модулей;
      // * Составление списка модулей;
      //
      /////////////////////

      for (const name of sync_project_deps) {
        const global_path = envConfig.resolveGlobalModule(name);
        const local_path = envConfig.resolveLocalModule(name);

        if (existsSync(global_path)) {
          console.log(chalk.white(`[ USED ][ GLOBAL_MODULE: ${global_path} ]`));

          linked_modules.push({ name, path: global_path });
        } else if (existsSync(local_path)) {
          // Внимание, modules_path - в этот список необходимо добавлять только глобально слинкованные модули.
          // Так как существует ситуация когда зависимости устанавдиваются локально, и не разрабатываются.
          console.log(chalk.bold.yellow(`[ USED ][ LOCAL_MODULE: ${local_path} ]`));
        } else {
          console.log(
            chalk.red(
              `[ ERROR ]` +
                `[ You haven't link in global node_modules ${global_path} or local node_modules ${local_path} ]`,
            ),
          );
          console.log(
            chalk.red(
              `[ ERROR ]` +
                `[ You need go to the project and do [ npm link || npm install ] needs module ]`,
            ),
          );

          process.exit(1);
        }
      }
      console.log("");
      // END

      if (linked_modules.length > 0) {
        /////////////////////
        //
        // * Составляю задач для копирования слинкованных модулей;
        //
        /////////////////////

        for (const module of linked_modules) {
          const pkg_path = path.resolve(module.path, "package.json");
          const config = new RearguardConfig(envConfig, pkg_path);

          if (existsSync(pkg_path)) {
            const files: string[] = [pkg_path];

            if (isArray(config.pkg.files)) {
              for (const file_name of config.pkg.files) {
                const file_path = path.resolve(module.path, file_name);

                if (existsSync(file_path)) {
                  files.push(`${file_path}/**`);
                } else {
                  console.log(
                    chalk.red(`[ COPY_TASK ][ ERROR ][ module haven't file: ${file_path} ]`),
                  );
                  console.log("");
                  process.exit(1);
                }
              }
            } else {
              console.log(chalk.red(`[ COPY_TASK ][ ERROR ][ module must defined 'files: []' ]`));
              console.log("");
              process.exit(1);
            }

            copyTasks.push({ version: config.pkg.version, name: module.name, files });
          } else {
            console.log(chalk.red(`[ COPY_TASK ][ ERROR ][ not found: ${pkg_path} ]`));
            console.log("");
            process.exit(1);
          }
        }
        // END

        /////////////////////
        //
        // * Фильтрация модулей, на те для которых есть слинованные замены и на те для которых нет.
        // * Удаление модулей для которых слинкованная замена.
        // * Восстановление директорий модулей для последующего наполнения.
        //
        /////////////////////

        const modules_for_remove: string[] = sync_project_deps
          .filter((name: string) => {
            for (const module of linked_modules) {
              if (module.name === name) {
                return true;
              }
            }

            return false;
          })
          .map((name: string) => envConfig.resolveLocalModule(name));

        for (const module_path of modules_for_remove) {
          if (existsSync(module_path)) {
            const paths = await del(module_path);

            for (const item of paths) {
              console.log(
                chalk.gray(`[ MODULE ][ REMOVE ][ ${path.relative(process.cwd(), item)} ]`),
              );
            }
          }

          await new Promise((resolve, reject) => {
            mkdirp(module_path, (error) => {
              if (error) {
                console.error(error);
                reject();
              } else {
                console.log(
                  chalk.green(
                    `[ MODULE ][ CREATED ][ DIR ][ ${path.relative(process.cwd(), module_path)} ]`,
                  ),
                );

                resolve();
              }
            });
          });
        }
        console.log("");
        // END

        /////////////////////
        //
        // * Выполнение задачь по копированияю.
        //
        /////////////////////

        const LOCAL_PKG = Object.assign({}, rearguardConfig.pkg);

        for (const task of copyTasks) {
          await new Promise((resolve, reject): void => {
            copy(
              task.files,
              envConfig.resolveLocalModule(task.name),
              (error: any, items: any[]) => {
                if (!error) {
                  if (envConfig.isDebug) {
                    for (const item of items) {
                      console.log(
                        chalk.cyan(`[ MODULE ][ COPY ][ ${task.name} ]`),
                        chalk.cyan(item.path),
                      );
                    }
                  } else {
                    console.log(
                      chalk.cyan(`[ MODULE ][ COPY ][ ${task.name} ]`),
                      chalk.cyan(`[ ${items.length} FILES ]`),
                    );
                  }

                  resolve();
                } else {
                  reject(error);
                }
              },
            );
          });

          for (const dep_type of ["dependencies", "devDependencies", "peerDependencies"]) {
            if (!isUndefined(LOCAL_PKG[dep_type]) && isString(LOCAL_PKG[dep_type][task.name])) {
              if (semver.valid(LOCAL_PKG[dep_type][task.name])) {
                LOCAL_PKG[dep_type][task.name] = task.version;
              }
            }
          }
        }

        // * Обновляем локальный package.json
        rearguardConfig.pkg = LOCAL_PKG;

        console.log("");
        console.log(
          chalk.bold.white(`[ UPDATED VERSIONS OF LINKED MODULES IN LOCAL PACKAGE.JSON ]`),
        );
        console.log("");
        // END
      } else {
        console.log(chalk.bold.gray("[ LINKED_MODULES_NOT_FOUNT ]"));
        console.log(chalk.bold.gray("[ USED ONLY LOCAL INSTALLED MODULES ]"));
        console.log("");
      }

      /////////////////////
      //
      // * END OF PROCEDURE
      //
      /////////////////////

      console.log(chalk.bold.blue(`============================================`));
      console.log("");
    }
  } catch (error) {
    console.trace(chalk.red(`[ ERROR_MESSAGE: ${getErrorMessage(error)} ]`));

    process.exit(1);
  }
}

// tslint:enable:variable-name
