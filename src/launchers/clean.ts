import * as path from "path";
import {isIsomorphic, output, servercOutput, staticServer} from "../config/target.config";
import {cleanDir} from "../lib/fs";

function clean() {
  return Promise.all([
    cleanDir(
      path.resolve(isIsomorphic || staticServer ? servercOutput : output.path, "*"),
      {
        dot: true,
        ignore: [path.resolve(output.path, ".git")],
        nosort: true,
      },
    ),
  ]);
}

export default clean;
