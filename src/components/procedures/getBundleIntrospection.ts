import * as path from "path";
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

export const getBundleIntrospections = async (
  CWD: string,
  isDevelopment: boolean,
): Promise<BundleIntrospection[]> => {
  const dependencies = await getSortedListOfDependencies(CWD);
  const localNodeModulePath = getLocalNodeModulePath(CWD);
  const bundleIntrospections: BundleIntrospection[] = [];

  for (const dependency of dependencies) {
    const rearguardConfig = new RearguardConfig(path.resolve(localNodeModulePath, dependency));
    const pkgName = rearguardConfig.getName();
    const pkgSnakeName = rearguardConfig.getSnakeName();
    const isBrowser = rearguardConfig.isBrowser();
    const isLib = rearguardConfig.isLib();

    const hasDll = false;
    const hasBrowserLib = isBrowser && isLib;

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
      dllManifestPath: hasDll ? getDLLManifestPath(CWD, pkgSnakeName, isDevelopment) : "",
    });
  }

  return bundleIntrospections;
};
