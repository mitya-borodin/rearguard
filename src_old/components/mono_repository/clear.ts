import chalk from "chalk";
import * as del from "del";
import * as path from "path";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, LIB_DIR_NAME } from "../../const";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";

// tslint:disable:variable-name

export async function clear(envConfig: IEnvConfig, CWD: string) {
  const { pkg } = new RearguardConfig(envConfig, path.resolve(CWD, "package.json"));

  const dll_bundle_dir = path.resolve(CWD, DLL_BUNDLE_DIR_NAME);
  const lib_bundle_dir = path.resolve(CWD, LIB_BUNDLE_DIR_NAME);
  const lib_dir = path.resolve(CWD, LIB_DIR_NAME);
  const node_modules = path.resolve(CWD, "node_modules");
  const dist = path.resolve(CWD, "dist");
  const delete_target: string[] = [node_modules, dist, dll_bundle_dir, lib_bundle_dir, lib_dir];
  const paths = await del(delete_target);

  for (const item of paths) {
    console.log(chalk.gray(`[ ${pkg.name} ][ REMOVE ][ ${item} ]`));
  }

  console.log("");
}

// tslint:enable:variable-name
