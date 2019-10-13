import * as AssetsWebpackPlugin from "assets-webpack-plugin";
import * as webpack from "webpack";
import { ASSETS_MANIFEST_NAME } from "../../../const";
import { RearguardConfig } from "../../../configs/RearguardConfig";
import { getLIBBundleOutputPath, getDLLBundleOutputPath } from "../../../helpers/bundleNaming";

export const getAssetsWebpackPlugin = (
  CWD: string,
  isDevelopment: boolean,
  forLib: boolean,
): webpack.Plugin => {
  const rearguardConfig = new RearguardConfig();
  const snakeName = rearguardConfig.getSnakeName();

  // * Path to assets home
  let path = getDLLBundleOutputPath(CWD, snakeName, isDevelopment);

  if (forLib) {
    path = getLIBBundleOutputPath(CWD, snakeName, isDevelopment);
  }

  return new AssetsWebpackPlugin({
    path,
    filename: ASSETS_MANIFEST_NAME,
    processOutput(data: any): string {
      const result: { [key: string]: any } = {};

      for (const key in data) {
        if (key.indexOf(snakeName) !== -1) {
          result[key] = data[key];
        }
      }

      return JSON.stringify(result, null, 2);
    },
  });
};
