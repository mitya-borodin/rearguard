import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";
import { getBundleIntrospections } from "./getBundleIntrospection";
import { LIST_OF_LOAD_ON_DEMAND, PRETTIER_DEFAULT } from "../../const";
import { RearguardConfig } from "../../configs/RearguardConfig";

export const createListModulesForLoadOnDemand = async (
  CWD: string,
  isDevelopment: boolean,
): Promise<void> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const bundleIntrospections = await getBundleIntrospections(CWD, isDevelopment);
  const listModulesForLoadOnDemandPath = path.resolve(
    CWD,
    rearguardConfig.getContext(),
    LIST_OF_LOAD_ON_DEMAND,
  );

  let source = "/* eslint:disable */\r";
  let needWrite = false;

  for (const {
    pkgSnakeName,
    willLoadOnDemand,
    hasDll,
    hasBrowserLib,
    assetsPath,
    bundleRuntimeName,
  } of bundleIntrospections) {
    if (willLoadOnDemand) {
      if (hasDll && hasBrowserLib) {
        if (fs.existsSync(assetsPath.dll) && fs.existsSync(assetsPath.lib)) {
          const dllPublicPath = require(assetsPath.dll)[bundleRuntimeName.dll].js;
          const libPublicPath = require(assetsPath.lib)[bundleRuntimeName.lib].js;

          source +=
            `export const ${pkgSnakeName}: { dll: string[], lib: string[] } = ` +
            `{ dll: [ "${bundleRuntimeName.dll}" , "${dllPublicPath}" ], lib: [ "${bundleRuntimeName.lib}", "${libPublicPath}" ] } \r`;

          needWrite = true;
        }
      }

      if (!hasDll && hasBrowserLib) {
        if (fs.existsSync(assetsPath.lib)) {
          const libPublicPath = require(assetsPath.lib)[bundleRuntimeName.lib].js;

          source += `export const ${pkgSnakeName} = { lib: [ "${bundleRuntimeName.lib}", "${libPublicPath}" ] } \r`;

          needWrite = true;
        }
      }
    }
  }

  source += "/* eslint:enable */\r\n";

  if (needWrite) {
    fs.writeFileSync(listModulesForLoadOnDemandPath, prettier.format(source, PRETTIER_DEFAULT));
  }
};
