import chalk from "chalk";
import webpack from "webpack";
import { getBundleIntrospections } from "../../components/procedures/getBundleIntrospection";
import { BundleIntrospection } from "../../interfaces/BundleIntrospection";
import { getLIBRuntimeName } from "../../helpers/bundleNaming";
import { RearguardConfig } from "../../configs/RearguardConfig";

export const getExternals = async (
  CWD: string,
  isDevelopment: boolean,
): Promise<webpack.ExternalsObjectElement> => {
  const rearguardConfig = new RearguardConfig(CWD);

  if (rearguardConfig.includeAllDependenciesToBundle()) {
    return {};
  }

  const bundleIntrospection: BundleIntrospection[] = await getBundleIntrospections(
    CWD,
    isDevelopment,
  );

  const externals: webpack.ExternalsObjectElement = {};

  for (const { hasBrowserLib, pkgName, pkgSnakeName } of bundleIntrospection) {
    if (hasBrowserLib) {
      externals[pkgName] = {
        var: getLIBRuntimeName(pkgSnakeName),
      };
    }
  }

  if (Object.keys(externals).length > 0) {
    console.log(chalk.bold.green("[ EXTERNAL ][ LIBs ]"));

    for (const key in externals) {
      if (externals.hasOwnProperty(key)) {
        const types = Object.keys(externals[key]);

        for (const type of types) {
          console.log(chalk.green(`[ ${key} ][ ${type} ][ ${externals[key][type]} ]`));
        }
      }
    }

    console.log(chalk.bold.green(""));
  }

  return externals;
};
