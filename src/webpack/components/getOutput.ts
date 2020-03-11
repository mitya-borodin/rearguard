import { resolve, normalize } from "path";
import webpack from "webpack";
import { RearguardConfig } from "../../configs/RearguardConfig";
import {
  getDLLBundleOutputPath,
  getDLLRuntimeName,
  getLIBBundleOutputPath,
  getLIBRuntimeName,
  getBundleSubDir,
} from "../../helpers/bundleNaming";

export const getAppOutput = (CWD: string, isDevelopment: boolean): webpack.Output => {
  const rearguardConfig = new RearguardConfig(CWD);
  const { path, publicPath } = rearguardConfig.getOutput();

  return { path: resolve(CWD, path), publicPath: isDevelopment ? "/" : publicPath };
};

export const getLibOutput = (CWD: string, isDevelopment: boolean): webpack.Output => {
  const rearguardConfig = new RearguardConfig(CWD);
  const snakeName = rearguardConfig.getSnakeName();
  const { publicPath, library, libraryTarget } = rearguardConfig.getOutput();

  return {
    path: getLIBBundleOutputPath(CWD, snakeName, isDevelopment),
    publicPath: normalize(
      `/${isDevelopment ? "/" : publicPath}/${snakeName}/${getBundleSubDir(isDevelopment)}/`,
    ),
    library: library || getLIBRuntimeName(snakeName),
    libraryTarget,
  };
};

export const getDllOutput = (CWD: string, isDevelopment: boolean): webpack.Output => {
  const rearguardConfig = new RearguardConfig(CWD);
  const snakeName = rearguardConfig.getSnakeName();
  const { publicPath, library, libraryTarget } = rearguardConfig.getOutput();

  return {
    path: getDLLBundleOutputPath(CWD, snakeName, isDevelopment),
    publicPath: normalize(
      `/${isDevelopment ? "/" : publicPath}/${snakeName}/${getBundleSubDir(isDevelopment)}/`,
    ),
    library: library || getDLLRuntimeName(snakeName),
    libraryTarget,
  };
};
