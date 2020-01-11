import chalk from "chalk";
import fs from "fs";
import path from "path";
import webpack from "webpack";
import { getBundleIntrospections } from "../../../components/procedures/getBundleIntrospection";
import { RearguardConfig } from "../../../configs/RearguardConfig";
import { getDLLManifestPath, getDLLRuntimeName } from "../../../helpers/bundleNaming";
import { BundleIntrospection } from "../../../interfaces/BundleIntrospection";

export const getDllPlugin = (CWD: string, isDevelopment: boolean): webpack.Plugin => {
  const rearguardConfig = new RearguardConfig(CWD);
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const snakeName = rearguardConfig.getSnakeName();

  return new webpack.DllPlugin({
    context: contextPath,
    name: getDLLRuntimeName(snakeName),
    path: getDLLManifestPath(CWD, snakeName, isDevelopment),
  });
};

export const getDllReferencePlugin = async (
  CWD: string,
  isDevelopment: boolean,
): Promise<webpack.Plugin[]> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const pkgSnakeName = rearguardConfig.getSnakeName();
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());

  const bundleIntrospection: BundleIntrospection[] = await getBundleIntrospections(
    CWD,
    isDevelopment,
  );

  const result: webpack.Plugin[] = [];

  for (const {
    hasDll,
    willLoadOnDemand,
    dllManifestPath,
    bundleRuntimeName,
  } of bundleIntrospection) {
    if (!willLoadOnDemand && hasDll) {
      if (path.isAbsolute(dllManifestPath) && fs.existsSync(dllManifestPath)) {
        result.push(
          new webpack.DllReferencePlugin({
            context: contextPath,
            manifest: dllManifestPath,
            name: bundleRuntimeName.dll,
          }),
        );
      } else {
        console.log(
          chalk.red(`[ DllReferencePlugin ][ ERROR ][ MANIFEST_NOT_FOUND: ${dllManifestPath} ]`),
        );

        process.exit(1);
      }
    }
  }

  const dllManifestPathForCurrentProject = getDLLManifestPath(CWD, pkgSnakeName, isDevelopment);

  if (fs.existsSync(dllManifestPathForCurrentProject)) {
    result.push(
      new webpack.DllReferencePlugin({
        context: contextPath,
        manifest: dllManifestPathForCurrentProject,
        name: getDLLRuntimeName(pkgSnakeName),
      }),
    );
  }

  console.log(
    1111,
    result,
    dllManifestPathForCurrentProject,
    fs.existsSync(dllManifestPathForCurrentProject),
  );

  return result;
};
