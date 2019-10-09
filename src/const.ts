import { PrettierOptions } from "./interfaces/PrettierOptions";

export const DLL_MANIFEST_NAME = "manifest.json";
export const ASSETS_MANIFEST_NAME = "assets.json";

// ! DIR/FILE_NAMES
export const DISTRIBUTIVE_DIR_NAME = "dist";
export const DLL_BUNDLE_DIR_NAME = "dll_bundle";
export const LIB_BUNDLE_DIR_NAME = "lib_bundle";
export const LIB_DIR_NAME = "lib";
export const TESTS_DIR_NAME = "tests";
export const BIN_DIR_NAME = "bin";
export const BIN_FILE_NAME = "index.ts";

// ! CONFIG FILE NAMES
export const TS_CONFIG_FILE_NAME = "tsconfig.json";
export const LINT_CONFIG_FILE_NAME = ".eslintrc";

// ! LIST_OF_LOAD_ON_DEMAND
export const LIST_OF_LOAD_ON_DEMAND = "list_for_load_on_demand.ts";

// ! PRETTIER_CONFIG
export const PRETTIER_DEFAULT: PrettierOptions = {
  printWidth: 100,
  trailingComma: "all",
  arrowParens: "always",
  parser: "typescript",
};

export const PRETTIER_JSON: PrettierOptions = {
  ...PRETTIER_DEFAULT,
  parser: "json",
};

export const PRETTIER_JSON_STRINGIFY: PrettierOptions = {
  ...PRETTIER_DEFAULT,
  parser: "json-stringify",
};
