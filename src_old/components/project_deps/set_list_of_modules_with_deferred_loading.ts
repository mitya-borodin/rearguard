import { existsSync, writeFileSync } from "fs";
import { resolve } from "path";
import * as prettier from "prettier";
import { DEFERRED_MODULE_LIST } from "../../const";
import { dll_entry_name, lib_entry_name } from "../../helpers";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import { IRearguardConfig } from "../../interfaces/config/IRearguardConfig";
import { IBundleInfo } from "../../interfaces/IBundleInfo";
import { get_bundles_info } from "./get_bundles_info";

// tslint:disable:variable-name

export async function set_list_of_modules_with_deferred_loading(
  envConfig: IEnvConfig,
  rearguardConfig: IRearguardConfig,
): Promise<void> {
  const bundles_info: IBundleInfo[] = get_bundles_info(envConfig, rearguardConfig);
  let source: string = "/* tslint:disable */\r";
  let need_write = false;

  for (const info of bundles_info) {
    if (info.load_on_demand) {
      const dll_name = dll_entry_name(info.bundle_name);
      const lib_name = lib_entry_name(info.bundle_name);

      if (info.has_dll && info.has_browser_lib) {
        const dll_public_path = require(info.assets.dll)[dll_name].js;
        const lib_public_path = require(info.assets.lib)[lib_name].js;

        source +=
          `export const ${info.bundle_name}: { dll: string[], lib: string[] } = ` +
          `{ dll: [ "${dll_name}" , "${dll_public_path}" ], lib: [ "${lib_name}", "${lib_public_path}" ] } \r`;

        need_write = true;
      }

      if (!info.has_dll && info.has_browser_lib) {
        const lib_public_path = require(info.assets.lib)[lib_name].js;

        source += `export const ${info.bundle_name} = { lib: [ "${lib_name}", "${lib_public_path}" ] } \r`;

        need_write = true;
      }
    }
  }

  source += "/* tslint:enable */\r\n";

  if (need_write) {
    writeFileSync(resolve(process.cwd(), "src", DEFERRED_MODULE_LIST), prettier.format(source).trim(), {
      encoding: "utf-8",
    });
  }
}

// tslint:enable:variable-name
