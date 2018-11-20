import { envConfig } from "./config/env";

export const NON_VERSIONABLE_CONFIG_FILE_NAME = "rearguard.json";
export const TS_CONFIG_FILE_NAME = "tsconfig.json";
export const TS_LINT_CONFIG_FILE_NAME = "tslint.json";
export const DIST_DIR_NAME = "dist";
export const DLL_BUNDLE_DIR_NAME = "dll_bundle";
export const DLL_MANIFEST_NAME = "manifest.json";
export const DLL_ASSETS_NAME = "assets.json";
export const LIB_BUNDLE_DIR_NAME = "lib_bundle";
export const BUNDLE_SUB_DIR = envConfig.isDevelopment ? "dev" : "prod";
export const LIB_DIR_NAME = "lib";
