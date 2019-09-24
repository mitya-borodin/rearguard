interface PrettierOptions {
  printWidth: number;
  trailingComma: "none" | "es5" | "all";
  arrowParens: "avoid" | "always";
  parser: "json" | "json-stringify";
}

// export const BUNDLE_SUB_DIR = () => (envConfig.isDevelopment ? "dev" : "prod");
export const DLL_MANIFEST_NAME = "manifest.json";
export const ASSETS_MANIFEST_NAME = "assets.json";

// ! DIR_NAMES
export const DISTRIBUTIVE_DIR_NAME = "dist";
export const DLL_BUNDLE_DIR_NAME = "dll_bundle";
export const LIB_BUNDLE_DIR_NAME = "lib_bundle";
export const LIB_DIR_NAME = "lib";
export const TESTS_DIR_NAME = "tests";

// ! CONFIG FILE NAMES
export const TS_CONFIG_FILE_NAME = "tsconfig.json";
export const LINT_CONFIG_FILE_NAME = ".eslintrc";

// ! LIST_OF_LOAD_ON_DEMAND
export const LIST_OF_LOAD_ON_DEMAND = "list_for_load_on_demand.ts";

// ! PRETTIER_CONFIG
const PRETTIER_DEFAULT: PrettierOptions = {
  printWidth: 100,
  trailingComma: "all",
  arrowParens: "always",
  parser: "json-stringify",
};

export const PRETTIER_JSON: PrettierOptions = {
  ...PRETTIER_DEFAULT,
  parser: "json",
};

export const PRETTIER_JSON_STRINGIFY: PrettierOptions = {
  ...PRETTIER_DEFAULT,
  parser: "json-stringify",
};
