import * as fs from "fs";
import * as path from "path";
import * as execa from "execa";

let cacheGlobalNodeModulePath = "";

export const getGlobalNodeModulePath = async (): Promise<string> => {
  if (cacheGlobalNodeModulePath !== "") {
    return cacheGlobalNodeModulePath;
  }

  const { stdout } = await execa("npm", ["root", "-g"], { encoding: "utf-8" });

  cacheGlobalNodeModulePath = stdout.replace("\n", "");

  return cacheGlobalNodeModulePath;
};

export const getLocalNodeModulePath = (CWD: string = process.cwd()): string => {
  return path.resolve(CWD, "node_modules");
};

export const getRearguardNodeModulesPath = async (CWD: string = process.cwd()): Promise<string> => {
  // * Get nodeModules paths
  const globalNodeModulePath = await getGlobalNodeModulePath();
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
