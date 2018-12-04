import { snakeCase } from "lodash";
import * as path from "path";
import { envConfig } from "./config/env";
import { pkgInfo } from "./config/pkg";
import { rearguardConfig } from "./config/rearguard";
import { ASSETS_NAME, BUNDLE_SUB_DIR, DLL_BUNDLE_DIR_NAME, DLL_MANIFEST_NAME, LIB_BUNDLE_DIR_NAME } from "./const";

// CONTEXT
export function get_context(): string {
  return path.resolve(process.cwd(), rearguardConfig.context);
}

export function get_output_path(): string {
  return path.resolve(process.cwd(), rearguardConfig.output.path);
}

export function dll_entry_name(name = snakeCase(pkgInfo.name)): string {
  return `___DLL___${name}`;
}

export function lib_entry_name(name = snakeCase(pkgInfo.name)): string {
  return `___LIBRARY___${name}`;
}

export function dll_output_path(root = envConfig.rootDir, name = snakeCase(pkgInfo.name)): string {
  return path.resolve(root, DLL_BUNDLE_DIR_NAME, name, BUNDLE_SUB_DIR);
}

export function lib_output_path(root = envConfig.rootDir, name = snakeCase(pkgInfo.name)): string {
  return path.resolve(root, LIB_BUNDLE_DIR_NAME, name, BUNDLE_SUB_DIR);
}

export function dll_assets_path(root = envConfig.rootDir, name = snakeCase(pkgInfo.name)): string {
  return path.resolve(dll_output_path(root, name), ASSETS_NAME);
}

export function lib_assets_path(root = envConfig.rootDir, name = snakeCase(pkgInfo.name)): string {
  return path.resolve(lib_output_path(root, name), ASSETS_NAME);
}

export function dll_manifest_path(root = envConfig.rootDir, name = snakeCase(pkgInfo.name)): string {
  return path.resolve(dll_output_path(root, name), DLL_MANIFEST_NAME);
}
