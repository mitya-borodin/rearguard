import { envConfig } from "./config/env";

export const BUNDLE_SUB_DIR = (): string => (envConfig.isDevelopment ? "dev" : "prod");
export const DLL_MANIFEST_NAME = "manifest.json";
export const ASSETS_NAME = "assets.json";

// ! DIR_NAMES
export const DIST_DIR_NAME = "dist";
export const DLL_BUNDLE_DIR_NAME = "dll_bundle";
export const LIB_BUNDLE_DIR_NAME = "lib_bundle";
export const LIB_DIR_NAME = "lib";
export const TESTS_DIR_NAME = "tests";

// ! CONFIG FILE NAMES
export const NON_VERSIONABLE_CONFIG_FILE_NAME = "rearguard.json";
export const TS_CONFIG_FILE_NAME = "tsconfig.json";
export const TEST_TS_CONFIG_FILE_NAME = `${TESTS_DIR_NAME}/tsconfig.json`;
export const TS_ES_LINT_CONFIG_FILE_NAME = "tslint.json";

// ! DEFERRED_LIST_FILE_NAME
export const DEFERRED_MODULE_LIST = "deferred_module_list.ts";
