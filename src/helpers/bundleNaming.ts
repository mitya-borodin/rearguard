import path from "path";
import {
  DLL_BUNDLE_DIR_NAME,
  LIB_BUNDLE_DIR_NAME,
  ASSETS_MANIFEST_NAME,
  DLL_MANIFEST_NAME,
  PUBLIC_DIR_NAME,
} from "../const";

export function getPublicDirPath(CWD: string): string {
  return path.resolve(CWD, PUBLIC_DIR_NAME);
}

export function getDLLRuntimeName(snakeName: string): string {
  return `DLL_${snakeName}`;
}

export function getLIBRuntimeName(snakeName: string): string {
  return `LIB_${snakeName}`;
}

export const getBundleSubDir = (isDevelopment: boolean): "dev" | "prod" =>
  isDevelopment ? "dev" : "prod";

export function getDLLBundleOutputPath(
  CWD: string,
  snakeName: string,
  isDevelopment: boolean,
): string {
  return path.resolve(CWD, DLL_BUNDLE_DIR_NAME, snakeName, getBundleSubDir(isDevelopment));
}

export function getLIBBundleOutputPath(
  CWD: string,
  snakeName: string,
  isDevelopment: boolean,
): string {
  return path.resolve(CWD, LIB_BUNDLE_DIR_NAME, snakeName, getBundleSubDir(isDevelopment));
}

// * Path to DLL bundle into CWD.
export function getDLLAssetsPath(CWD: string, snakeName: string, isDevelopment: boolean): string {
  return path.resolve(getDLLBundleOutputPath(CWD, snakeName, isDevelopment), ASSETS_MANIFEST_NAME);
}

// * Path to LIB bundle into CWD.
export function getLIBAssetsPath(CWD: string, snakeName: string, isDevelopment: boolean): string {
  return path.resolve(getLIBBundleOutputPath(CWD, snakeName, isDevelopment), ASSETS_MANIFEST_NAME);
}

// * Path to DLL Manifest into CWD.
export function getDLLManifestPath(CWD: string, snakeName: string, isDevelopment: boolean): string {
  return path.resolve(getDLLBundleOutputPath(CWD, snakeName, isDevelopment), DLL_MANIFEST_NAME);
}
