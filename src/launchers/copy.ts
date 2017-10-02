import * as path from "path";
import {
  context,
  dependencies,
  engines,
  isIsomorphic,
  publicDirName,
  servercOutput,
  serverEntry,
  staticServer,
} from "../config/target.config";
import {copyDir, copyFile, makeDir, writeFile} from "../lib/fs";
import makeServerConfig from "./makeServerConfig";

async function copy() {
  if (staticServer) {
    await makeDir(servercOutput);
    await copyFile(path.resolve(__dirname, "./staticServerOrigin.js"), path.resolve(servercOutput, serverEntry));
  }
  if (isIsomorphic || staticServer) {
    const {dependencies: rearguardDep} = require(path.resolve(__dirname, "../../../package.json"));

    await makeDir(servercOutput);
    await writeFile(path.resolve(servercOutput, "package.json"), JSON.stringify({
      dependencies: {
        ...dependencies,
        ["source-map-support"]: rearguardDep["source-map-support"],
        ["http-proxy-middleware"]: rearguardDep["http-proxy-middleware"],
      },
      engines,
      private: true,
      scripts: {
        start: `node ${serverEntry}`,
      },
    }, null, 2));
    await makeServerConfig(servercOutput);
    await copyDir(path.resolve(context, `../${publicDirName}`), path.resolve(servercOutput, publicDirName));
  } else {
    await copyDir(path.resolve(context, `../${publicDirName}`), path.resolve(servercOutput));
  }
}

export default copy;
