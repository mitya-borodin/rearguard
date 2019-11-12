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

export const getAppOutput = (CWD: string): webpack.Output => {
  const rearguardConfig = new RearguardConfig(CWD);
  const { path, publicPath } = rearguardConfig.getOutput();

  return { path: resolve(CWD, path), publicPath };
};

export const getLibOutput = (CWD: string, isDevelopment: boolean): webpack.Output => {
  const rearguardConfig = new RearguardConfig(CWD);
  const snakeName = rearguardConfig.getSnakeName();
  const { publicPath } = rearguardConfig.getOutput();

  return {
    path: getLIBBundleOutputPath(CWD, snakeName, isDevelopment),
    publicPath: normalize(`${publicPath}/${snakeName}/${getBundleSubDir(isDevelopment)}/`),
    library: getLIBRuntimeName(snakeName),
    libraryTarget: "var",
  };
};

export const getDllOutput = (CWD: string, isDevelopment: boolean): webpack.Output => {
  const rearguardConfig = new RearguardConfig(CWD);
  const snakeName = rearguardConfig.getSnakeName();
  const { publicPath } = rearguardConfig.getOutput();

  return {
    path: getDLLBundleOutputPath(CWD, snakeName, isDevelopment),
    publicPath: normalize(`${publicPath}/${snakeName}/${getBundleSubDir(isDevelopment)}/`),
    library: getDLLRuntimeName(snakeName),
    libraryTarget: "var",
  };
};
