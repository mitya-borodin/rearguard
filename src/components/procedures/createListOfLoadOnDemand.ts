import { writeFileSync } from "fs";
import { resolve } from "path";
import * as prettier from "prettier";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { LIST_OF_LOAD_ON_DEMAND, PRETTIER_DEFAULT } from "../../const";
import { getDLLRuntimeName, getLIBRuntimeName } from "../../helpers/bundleNaming";
import { getBundleIntrospections } from "./getBundleIntrospection";

export const createListOfLoadOnDemand = async (
  CWD: string,
  isDevelopment: boolean,
): Promise<void> => {
  const bundleIntrospections = await getBundleIntrospections(CWD, isDevelopment);
  const rearguardConfig = new RearguardConfig(CWD);
  const content: string[] = [];

  for (const {
    pkgSnakeName,
    hasDll,
    hasBrowserLib,
    assetsPath,
    willLoadOnDemand,
  } of bundleIntrospections) {
    if (willLoadOnDemand) {
      const dllName = getDLLRuntimeName(pkgSnakeName);
      const libName = getLIBRuntimeName(pkgSnakeName);
      const libPublicPath = require(assetsPath.lib)[libName].js;

      if (hasDll && hasBrowserLib) {
        const dllPublicPath = require(assetsPath.dll)[dllName].js;

        content.push(
          `export const ${pkgSnakeName}: LoadOnDemand = ` +
            `{ dll: [ "${dllName}" , "${dllPublicPath}" ], lib: [ "${libName}", "${libPublicPath}" ] };`,
        );
      }

      if (!hasDll && hasBrowserLib) {
        content.push(
          `export const ${pkgSnakeName}: LoadOnDemand = { dll: [], lib: [ "${libName}", "${libPublicPath}" ] };`,
        );
      }
    }
  }

  if (content.length > 0) {
    content.unshift("export declare type LoadOnDemand = { dll: string[], lib: string[] };");

    writeFileSync(
      resolve(CWD, rearguardConfig.getContext(), LIST_OF_LOAD_ON_DEMAND),
      prettier.format(content.join(" "), PRETTIER_DEFAULT),
    );
  }
};
