import mkdirp from "mkdirp";

export function mkdir(dir: string): mkdirp.Made {
  return mkdirp.sync(dir);
}
