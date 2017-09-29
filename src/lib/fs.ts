import * as fs from "fs";
import * as glob from "glob";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as rimraf from "rimraf";

export const readFile = (file: string) => new Promise((resolve, reject) => {
  fs.readFile(file, "utf8", (err, data) => (err ? reject(err) : resolve(data)));
});

export const writeFile = (file: string, contents: string | Buffer) => new Promise((resolve, reject) => {
  fs.writeFile(file, contents, "utf8", (err) => (err ? reject(err) : resolve()));
});

export const renameFile = (source: string, target: string) => new Promise((resolve, reject) => {
  fs.rename(source, target, (err) => (err ? reject(err) : resolve()));
});

export const copyFile = (source: string, target: string) => new Promise((resolve, reject) => {
  let cbCalled = false;

  function done(err: any) {
    if (!cbCalled) {
      cbCalled = true;
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }
  }

  const rd = fs.createReadStream(source);
  rd.on("error", (err) => done(err));
  const wr = fs.createWriteStream(target);
  wr.on("error", (err) => done(err));
  wr.on("close", (err: any) => done(err));
  rd.pipe(wr);
});

export const readDir = (pattern: string, options: any): Promise<string[]> => new Promise((resolve, reject) =>
  glob(pattern, options, (err, result) => (err ? reject(err) : resolve(result))),
);

export const makeDir = (name: string) => new Promise((resolve, reject) => {
  mkdirp(name, (err) => (err ? reject(err) : resolve()));
});

export const moveDir = async (source: string, target: string) => {
  const dirs: string[] = await readDir("**/*.*", {
    cwd: source,
    dot: true,
    nosort: true,
  });
  await Promise.all(
    dirs.map(
      async (dir: string) => {
        const from = path.resolve(source, dir);
        const to = path.resolve(target, dir);
        await makeDir(path.dirname(to));
        await renameFile(from, to);
      },
    ),
  );
};

export const copyDir = async (source: string, target: string) => {
  const dirs: string[] = await readDir("**/*.*", {
    cwd: source,
    dot: true,
    nosort: true,
  });

  await Promise.all(
    dirs.map(
      async (dir: string) => {
        const from = path.resolve(source, dir);
        const to = path.resolve(target, dir);
        await makeDir(path.dirname(to));
        await copyFile(from, to);
      },
    ),
  );
};

export const cleanDir = (pattern: string, options: {}) => new Promise((resolve, reject) =>
  rimraf(pattern, {glob: options}, (err) => (err ? reject(err) : resolve())),
);

export default {
  cleanDir,
  copyDir,
  copyFile,
  makeDir,
  moveDir,
  readDir,
  readFile,
  renameFile,
  writeFile,
};
