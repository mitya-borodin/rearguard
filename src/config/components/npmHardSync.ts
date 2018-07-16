import chalk from "chalk";
import * as chokidar from "chokidar";
import { FSWatcher } from "chokidar";
import * as copy from "copy";
import * as del from "del";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import {
  isDebug,
  npmHardSyncLinks,
  resolveGlobalNodeModules,
  root,
} from "./target.config";

const watchers: FSWatcher[] = [];

export async function npmHardSyncStart(watch: boolean = true) {
  console.log("");
  console.log(chalk.bold.yellow("[ NPM_HARD_SYNC ]"));

  const npmHardSyncTarget = npmHardSyncLinks.map(resolveGlobalNodeModules);

  for (const npmLink of npmHardSyncTarget) {
    if (!fs.existsSync(npmLink)) {
      console.log(
        chalk.bold.red(`You havn't link in global space on ${npmLink}`),
      );
      console.log(
        chalk.bold.cyan(`You need go to the project and do npm link;`),
      );

      throw new Error(`Symlink not found: ${npmLink}`);
    } else {
      console.log(chalk.bold.yellow(`[ ORIGIN_SYMLINK: ${npmLink} ]`));
    }
  }

  const npmHardSyncCopyTarget = npmHardSyncTarget.map((modulePath, index) => {
    const copiesTarget: { moduleName: string; paths: string[] } = {
      moduleName: npmHardSyncLinks[index],
      paths: [],
    };
    const pkgPath = path.resolve(modulePath, "package.json");

    if (fs.existsSync(pkgPath)) {
      copiesTarget.paths.push(pkgPath);

      const { files } = require(path.resolve(modulePath, "package.json"));

      for (const file of files) {
        const filePath = path.resolve(modulePath, file);

        if (fs.existsSync(filePath)) {
          copiesTarget.paths.push(`${filePath}/**/*.d.ts`);
          copiesTarget.paths.push(`${filePath}/**/*.js`);
        }
      }
    }

    return copiesTarget;
  });
  const LOCAL_NODE_MODULES = path.resolve(root, "node_modules");
  const localCopies = npmHardSyncLinks.map((link) =>
    path.resolve(LOCAL_NODE_MODULES, link),
  );

  for (const localCopy of localCopies) {
    await new Promise((resolve, reject) => {
      if (fs.existsSync(localCopy)) {
        del(localCopy).then((paths) => {
          for (const item of paths) {
            console.log(
              chalk.yellow("[ REMOVED_LOCAL_COPY ]"),
              chalk.cyan(item),
            );
          }
          mkdirp(localCopy, (error) => {
            if (error) {
              console.error(error);
              reject();
            } else {
              console.log(
                chalk.yellow("[ CREATED_DIR ]", chalk.cyan(`${localCopy}`)),
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
              chalk.yellow("[ CREATED_DIR ]", chalk.cyan(`${localCopy}`)),
            );

            resolve();
          }
        });
      }
    });
  }

  for (const { moduleName, paths } of npmHardSyncCopyTarget) {
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
            console.error(error);
            reject();
          }
        },
      );
    });
  }

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
            chalk.yellow(`[ NPM_HARD_SYNC ][ UPDATE ][ ${insidePath} ]`),
          );
        }
      });

      watchers.push(watcher);
    }
  }
}
