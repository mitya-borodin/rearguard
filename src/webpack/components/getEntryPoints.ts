import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { getDLLRuntimeName, getLIBRuntimeName } from "../../helpers/bundleNaming";
import { Entry } from "webpack";

export const getAppEntryPoints = async (CWD: string): Promise<string[]> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const entryPath = path.resolve(contextPath, rearguardConfig.getEntry());

  return [entryPath];
};

export const getLibEntryPoint = async (CWD: string): Promise<Entry> => {
  // * Prepare config
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare paths
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const libEntryPath = path.resolve(contextPath, rearguardConfig.getLibEntry());

  // * Getting pkg.name in snakeCase.
  const snakeName = rearguardConfig.getSnakeName();

  return {
    [getLIBRuntimeName(snakeName)]: [libEntryPath],
  };
};

export const getDllEntryPoint = async (CWD: string): Promise<Entry> => {
  // * Prepare config
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare paths
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const dllEntryPath = path.resolve(contextPath, rearguardConfig.getDllEntry());

  // * Getting pkg.name in snakeCase.
  const snakeName = rearguardConfig.getSnakeName();

  return {
    [getDLLRuntimeName(snakeName)]: [dllEntryPath],
  };
};
