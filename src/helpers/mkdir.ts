import mkdirp from "mkdirp";

export function mkdir(dir: string): string | undefined {
  return mkdirp.sync(dir);
}
