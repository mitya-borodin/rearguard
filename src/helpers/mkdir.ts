import * as mkdirp from "mkdirp";

export function mkdir(dir: string): Promise<mkdirp.Made> {
  return new Promise((resolve, reject) => {
    mkdirp(dir, (err: NodeJS.ErrnoException, made: mkdirp.Made) => {
      if (err) {
        reject(err);
      } else {
        resolve(made);
      }
    });
  });
}
