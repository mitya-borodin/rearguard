import fs from "fs";
import path from "path";
import execa from "execa";

let cacheGlobalNodeModulePath = "";

export const getGlobalNodeModulePath = (): string => {
  if (cacheGlobalNodeModulePath !== "") {
    return cacheGlobalNodeModulePath;
  }

  const { stdout } = execa.sync("npm", ["root", "-g"], { encoding: "utf-8" });

  cacheGlobalNodeModulePath = stdout.replace("\n", "");

  return cacheGlobalNodeModulePath;
};

export const getLocalNodeModulePath = (CWD: string): string => {
  return path.resolve(CWD, "node_modules");
};

export const getRearguardNodeModulesPath = (CWD: string): string => {
  // * Get nodeModules paths
  const globalNodeModulePath = getGlobalNodeModulePath();
  const localNodeModulePath = getLocalNodeModulePath(CWD);

  // * Path to locally installed rearguard
  const locallyInstalledRearguard = path.resolve(localNodeModulePath, "rearguard");

  // ? Check whether the rearguard is installed locally or not
  if (fs.existsSync(locallyInstalledRearguard)) {
    return localNodeModulePath;
  }

  // * Global nodeModules from rearguard
  const globalRearguardNodeModules = path.resolve(globalNodeModulePath, "rearguard/node_modules");

  // ? Check whether the rearguard is installed globally or not
  if (fs.existsSync(globalRearguardNodeModules)) {
    return globalRearguardNodeModules;
  }

  throw new Error("Rearguard in not installed, please execute `npm i -g rearguard`.");
};

export const getTypescriptBin = (CWD: string): string => {
  return path.resolve(getRearguardNodeModulesPath(CWD), ".bin/tsc");
};

export const getTypescriptNodeDevBin = (CWD: string): string => {
  return path.resolve(getRearguardNodeModulesPath(CWD), ".bin/ts-node-dev");
};
