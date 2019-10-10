import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { getDLLRuntimeName, getLIBRuntimeName } from "../../helpers/bundleNaming";
import { getRearguardNodeModulesPath } from "../../helpers/dependencyPaths";

export const getAppEntryPoints = async (CWD: string, isDevelopment: boolean): Promise<string[]> => {
  // * Prepare configs
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  // * Prepare paths
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const entryPath = path.resolve(contextPath, rearguardConfig.getEntry());

  // * Getting WDS host, port
  const { host, port } = await rearguardLocalConfig.getWDSConfig();

  // * Getting rearguard nodeModulesPath
  const nodeModulesPath = await getRearguardNodeModulesPath(CWD);

  // * Getting modules from rearguard dependencies
  const WDSModulesPath = path.resolve(nodeModulesPath, "webpack-dev-server");
  const webpackModulesPath = path.resolve(nodeModulesPath, "webpack");

  if (isDevelopment) {
    return [
      `${WDSModulesPath}/client?https://${host}:${port}`,
      `${webpackModulesPath}/hot/only-dev-server`,
      entryPath,
    ];
  }

  return [entryPath];
};

export const getLibEntryPoint = async (CWD: string): Promise<{ [key: string]: string }> => {
  // * Prepare config
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare paths
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const libEntryPath = path.resolve(contextPath, rearguardConfig.getLibEntry());

  // * Getting pkg.name in snakeCase.
  const snakeName = rearguardConfig.getSnakeName();

  return {
    [getLIBRuntimeName(snakeName)]: libEntryPath,
  };
};

export const getDllEntryPoint = async (CWD: string): Promise<{ [key: string]: string }> => {
  // * Prepare config
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare paths
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const dllEntryPath = path.resolve(contextPath, rearguardConfig.getDllEntry());

  // * Getting pkg.name in snakeCase.
  const snakeName = rearguardConfig.getSnakeName();

  return {
    [getDLLRuntimeName(snakeName)]: dllEntryPath,
  };
};
