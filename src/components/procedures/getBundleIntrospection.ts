import fs from "fs";
import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import {
  getDLLAssetsPath,
  getDLLManifestPath,
  getDLLRuntimeName,
  getLIBAssetsPath,
  getLIBRuntimeName,
} from "../../helpers/bundleNaming";
import { getLocalNodeModulePath } from "../../helpers/dependencyPaths";
import { BundleIntrospection } from "../../interfaces/BundleIntrospection";
import { getSortedListOfDependencies } from "./getSortedListOfDependencies";
import { promisify } from "util";

const exists = promisify(fs.exists);

export const getBundleIntrospections = async (
  CWD: string,
  isDevelopment: boolean,
): Promise<BundleIntrospection[]> => {
  const dependencies = await getSortedListOfDependencies(CWD);
  const localNodeModulePath = getLocalNodeModulePath(CWD);
  const bundleIntrospections: BundleIntrospection[] = [];

  for (const dependency of dependencies) {
    const dependencyCWD = path.resolve(localNodeModulePath, dependency);
    const rearguardConfig = new RearguardConfig(dependencyCWD);
    const pkgName = rearguardConfig.getName();
    const pkgSnakeName = rearguardConfig.getSnakeName();
    const isBrowser = rearguardConfig.isBrowser();
    const isLib = rearguardConfig.isLib();
    const isIsomorphic = rearguardConfig.isIsomorphic();

    const dllManifestPath = getDLLManifestPath(CWD, pkgSnakeName, isDevelopment);

    const hasDll = await exists(dllManifestPath);
    const hasBrowserLib = (isBrowser && isLib) || isIsomorphic;

    bundleIntrospections.push({
      pkgName,
      pkgSnakeName,
      hasDll,
      hasBrowserLib,
      willLoadOnDemand: rearguardConfig.willLoadOnDemand(),
      bundleRuntimeName: {
        dll: hasDll ? getDLLRuntimeName(pkgSnakeName) : "",
        lib: hasBrowserLib ? getLIBRuntimeName(pkgSnakeName) : "",
      },
      assetsPath: {
        dll: hasDll ? getDLLAssetsPath(CWD, pkgSnakeName, isDevelopment) : "",
        lib: hasBrowserLib ? getLIBAssetsPath(CWD, pkgSnakeName, isDevelopment) : "",
      },
      dllManifestPath: hasDll ? dllManifestPath : "",
    });
  }

  return bundleIntrospections;
};
