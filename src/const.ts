import { PrettierOptions } from "./interfaces/PrettierOptions";

export const DLL_MANIFEST_NAME = "webpack-dll-manifest.json";
export const ASSETS_MANIFEST_NAME = "webpack-assets.json";

// ! DIR/FILE_NAMES
export const DISTRIBUTIVE_DIR_NAME = "dist";
export const PUBLIC_DIR_NAME = "public";
export const DLL_BUNDLE_DIR_NAME = "dll_bundle";
export const LIB_BUNDLE_DIR_NAME = "lib_bundle";
export const LIB_DIR_NAME = "lib";
export const TESTS_DIR_NAME = "tests";
export const BIN_DIR_NAME = "bin";
export const BIN_FILE_NAME = "index.ts";
export const BUILD_ASSETS_DIR_NAME = "buildAssets";
export const TYPE_DECLARATION_DIR_NAME = "types";
export const VS_CODE = ".vscode";
export const VS_CODE_SETTINGS = ".vscode/settings.json";

// ! CONFIG FILE NAMES
export const TS_CONFIG_FILE_NAME = "tsconfig.json";
export const ES_LINT_CONFIG_FILE_NAME = ".eslintrc.json";
export const ES_LINT_IGNORE_FILE_NAME = ".eslintignore";
export const STYLE_LINT_CONFIG_FILE_NAME = ".stylelintrc.json";
export const STYLE_LINT_IGNORE_FILE_NAME = ".stylelintignore";
export const REARGUARD_DEV_CONFIG_FILE_NAME = "rearguard-dev.json";
export const PACKAGE_JSON_FILE_NAME = "package.json";

// ! LIST_OF_MODULES_WHICH_LOAD_ON_DEMAND
export const LIST_OF_MODULES_WHICH_LOAD_ON_DEMAND = "listOfModulesWhichLoadOnDemand.ts";

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
