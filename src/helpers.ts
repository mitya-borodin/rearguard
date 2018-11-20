import { snakeCase } from "lodash";
import * as path from "path";
import { envConfig } from "./config/env";
import { pkgInfo } from "./config/pkg";
import { BUNDLE_SUB_DIR, DLL_ASSETS_NAME, DLL_BUNDLE_DIR_NAME, DLL_MANIFEST_NAME, LIB_BUNDLE_DIR_NAME } from "./const";

export function lib_entry_name(): string {
  return `lib_${snakeCase(pkgInfo.name)}`;
}

export function lib_path(): string {
  return path.resolve(envConfig.rootDir, LIB_BUNDLE_DIR_NAME, snakeCase(pkgInfo.name), BUNDLE_SUB_DIR);
}

export function dll_entry_name(): string {
  return `dll_${snakeCase(pkgInfo.name)}`;
}

export function dll_path(): string {
  return path.resolve(envConfig.rootDir, DLL_BUNDLE_DIR_NAME, snakeCase(pkgInfo.name), BUNDLE_SUB_DIR);
}

export function dll_manifest_path(): string {
  return path.resolve(dll_path(), DLL_MANIFEST_NAME);
}

export function dll_assets_path(): string {
  return path.resolve(dll_path(), DLL_ASSETS_NAME);
}
