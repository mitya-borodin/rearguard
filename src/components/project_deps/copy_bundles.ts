import chalk from "chalk";
import * as copy from "copy";
import * as del from "del";
import { existsSync } from "fs";
import { snakeCase } from "lodash";
import * as mkdirp from "mkdirp";
import * as moment from "moment";
import * as path from "path";
import { envConfig } from "../../config/env";
import { rearguardConfig } from "../../config/rearguard";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME } from "../../const";

// tslint:disable:variable-name
export async function copy_bundles() {
  if (
    (envConfig.isWDS || envConfig.isBuild) &&
    !(envConfig.has_dll || envConfig.has_browser_lib || envConfig.has_node_lib)
  ) {
    const startTime = moment();

    console.log(chalk.bold.blue(`==============COPY_BUNDLES=============`));
    console.log("");

    /////////////////////
    //
    // START OF PROCEDURE
    //
    /////////////////////

    try {
      for (const module of rearguardConfig.sync_project_deps) {
        const module_path = envConfig.resolveLocalModule(module);
        const { has_dll, has_browser_lib, pkg } = new RearguardConfig(
          envConfig,
          path.resolve(module_path, "package.json"),
        );

        if (has_dll || has_browser_lib) {
          await copy_bundle(module_path, DLL_BUNDLE_DIR_NAME, pkg.name);
        }

        if (has_browser_lib) {
          await copy_bundle(module_path, LIB_BUNDLE_DIR_NAME, pkg.name);
        }
      }
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    /////////////////////
    //
    // END OF PROCEDURE
    //
    /////////////////////

    const endTime = moment();

    console.log("");
    console.log(chalk.bold.blue(`[ SPEED ][ ${endTime.diff(startTime, "milliseconds")} ms ]`));
    console.log(chalk.bold.blue(`=======================================`));
    console.log("");
  }
}

async function copy_bundle(module_path: string, bundle_dirname: string, pkg_name: string) {
  try {
    // Имя пакета (package.json).name;
    const name = snakeCase(pkg_name);
    // Путь до бандла из установленого модуля.
    const source_bundle = path.resolve(module_path, bundle_dirname, name);
    // Путь до бандла который находится в проекте.
    const target_bundle = path.resolve(process.cwd(), bundle_dirname, name);

    // Удаляю бандл из проекта.
    if (existsSync(target_bundle)) {
      const paths = await del(target_bundle);

      for (const item of paths) {
        console.log(chalk.gray(`[ REMOVE ][ ${name} ][ ${path.relative(process.cwd(), item)} ]`));
      }
    }
    /////////////////////
    //
    // Если существует бандл в node_modules то создаю директорию и копирую в неё содержимое источника.
    //
    /////////////////////

    if (existsSync(source_bundle)) {
      await new Promise((resolve, reject) => {
        mkdirp(target_bundle, (error) => {
          if (error) {
            reject(error);
          } else {
            console.log(chalk.green(`[ CREATED ][ DIR ][ ${name} ][ ${path.relative(process.cwd(), target_bundle)} ]`));

            resolve();
          }
        });
      });

      await new Promise((resolve, reject) => {
        copy([`${source_bundle}/**`], target_bundle, (error: any, items: any[]) => {
          if (!error) {
            if (envConfig.isDebug) {
              for (const item of items) {
                console.log(chalk.cyan(`[ COPY ][ ${name} ][ ${path.relative(process.cwd(), item.path)} ]`));
              }
            } else {
              console.log(chalk.cyan(`[ COPY ][ ${name} ][ ${items.length} FILES ]`));
            }

            resolve();
          } else {
            reject(error);
          }
        });
      });

      console.log("");
    }
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

// tslint:enable:variable-name
