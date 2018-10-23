import chalk from "chalk";
import * as chokidar from "chokidar";
import { FSWatcher } from "chokidar";
import * as copy from "copy";
import * as del from "del";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as semver from "semver";
import {
  isDebug,
  resolveGlobalNodeModules,
  root,
  sync_npm_deps as dep_list,
} from "./target.config";

const watchers: FSWatcher[] = [];

export async function sync_npm_deps(watch: boolean = true) {
  if (dep_list.length === 0) {
    console.log(chalk.bold.gray("[ SYNC_NPM ][ LIST IS EMPTY ]"));
    return;
  }

  console.log("");
  console.log(chalk.bold.yellow("[ SYNC_NPM ]"));
  console.log(chalk.bold.magenta(`[ SYNC_LIST ][ ${dep_list.join(", ")} ]`));
  const localPkgPath = path.resolve(root, "package.json");
  const localPkg = require(localPkgPath);
  const npmHardSyncTarget = dep_list.map(resolveGlobalNodeModules);

  for (const npmLink of npmHardSyncTarget) {
    if (!fs.existsSync(npmLink)) {
      console.log(
        chalk.bold.red(
          `[ SYNC_NPM ][ ERROR ][ You haven't link in global space on ${npmLink} ]`,
        ),
      );
      console.log(
        chalk.bold.red(
          `[ SYNC_NPM ][ ERROR ][ You need go to the project and do npm link ]`,
        ),
      );

      throw new Error(`Symlink not found: ${npmLink}`);
    } else {
      console.log(chalk.bold.yellow(`[ ORIGIN_SYMLINK: ${npmLink} ]`));
    }
  }

  // Составляю объект с настройками для копирования и обновления версий пакетов.
  const npmHardSyncCopyTarget = npmHardSyncTarget.map(
    (modulePath: string, index: number) => {
      const copiesTarget: {
        moduleName: string;
        paths: string[];
        pkg: string;
      } = {
        moduleName: dep_list[index],
        paths: [],
        pkg: "",
      };
      const pkgPath = path.resolve(modulePath, "package.json");

      if (fs.existsSync(pkgPath)) {
        copiesTarget.pkg = pkgPath;
        copiesTarget.paths.push(pkgPath);

        const { files } = require(pkgPath);

        for (const file of files) {
          const filePath = path.resolve(modulePath, file);

          if (fs.existsSync(filePath)) {
            copiesTarget.paths.push(`${filePath}/**`);
          }
        }
      }

      return copiesTarget;
    },
  );
  const LOCAL_NODE_MODULES = path.resolve(root, "node_modules");
  const localCopies = dep_list.map((link: string) => {
    return path.resolve(LOCAL_NODE_MODULES, link);
  });

  // Удаляю существующие директории пакетов из node_modules;
  for (const localCopy of localCopies) {
    await new Promise((resolve, reject) => {
      if (fs.existsSync(localCopy)) {
        del(localCopy).then((paths) => {
          for (const item of paths) {
            console.log(chalk.red("[ REMOVED_LOCAL_COPY ]"), chalk.cyan(item));
          }
          mkdirp(localCopy, (error) => {
            if (error) {
              console.error(error);
              reject();
            } else {
              console.log(
                chalk.green("[ CREATED_DIR ]", chalk.cyan(`${localCopy}`)),
              );

              resolve();
            }
          });
        });
      } else {
        mkdirp(localCopy, (error) => {
          if (error) {
            console.error(error);
            reject();
          } else {
            console.log(
              chalk.green("[ CREATED_DIR ]", chalk.cyan(`${localCopy}`)),
            );

            resolve();
          }
        });
      }
    });
  }

  // Непосредственно единоразовое копирование файлов и обновление версий.

  for (const { moduleName, paths, pkg } of npmHardSyncCopyTarget) {
    await new Promise((resolve, reject) => {
      copy(
        paths,
        path.resolve(LOCAL_NODE_MODULES, moduleName),
        (error: any, files: any[]) => {
          if (!error) {
            if (isDebug) {
              for (const file of files) {
                console.log(
                  chalk.yellow(`[ COPIED ][ ${moduleName} ]`),
                  chalk.cyan(file.path),
                );
              }
            } else {
              console.log(
                chalk.yellow(`[ COPIED ][ ${moduleName} ]`),
                chalk.cyan(`[ ${files.length} FILES ]`),
              );
            }

            resolve();
          } else {
            reject(error);
          }
        },
      );
    });
    const targetPkg = require(pkg);

    if (semver.valid(localPkg.dependencies[moduleName])) {
      localPkg.dependencies[moduleName] = targetPkg.version;
    }
  }

  fs.writeFileSync(localPkgPath, JSON.stringify(localPkg, null, 2), {
    encoding: "utf-8",
  });

  try {
    if (watch) {
      console.log(chalk.yellow("[ WATCH_INIT ]"));

      if (watchers.length > 0) {
        for (const watcher of watchers) {
          watcher.close();
        }
      }

      for (const { moduleName, paths } of npmHardSyncCopyTarget) {
        const watcher = chokidar.watch(paths);

        watcher.on("change", (from) => {
          const insidePath = from.substr(
            from.indexOf(moduleName) + moduleName.length + 1,
            from.length,
          );
          const to = path.resolve(LOCAL_NODE_MODULES, moduleName, insidePath);

          fs.unlinkSync(to);
          if (isDebug) {
            console.log("");
            console.log(chalk.yellow("[ REMOVED_LOCAL_COPY ]"));
            console.log(chalk.cyan(`[ OF: ${to} ]`));
          }

          fs.copyFileSync(from, to);
          if (isDebug) {
            console.log("");
            console.log(chalk.yellow(`[ COPIED ][ ${moduleName} ]`));
            console.log(chalk.cyan(`[ FROM: ${from} ]`));
            console.log(chalk.cyan(`[ TO ${to} ]`));
          }
          if (!isDebug) {
            console.log(
              chalk.yellow(`[ SYNC_NPM ][ UPDATE ][ ${insidePath} ]`),
            );
          }
        });

        watchers.push(watcher);
      }
    }
  } catch (error) {
    console.log("");
    console.error(error);
    console.log(
      chalk.bold.red(`[ SYNC_NPM ][ ERROR_MESSAGE: ${error.message} ]`),
    );
    console.log(chalk.yellow(`[ SYNC_NPM ][ WILL_RESTARTED_TROUGHT 1000ms; ]`));

    setTimeout(sync_npm_deps, 1000);
  }
}
