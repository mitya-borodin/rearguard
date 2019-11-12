import webpack from "webpack";
import { RearguardDevConfig } from "../../../configs/RearguardDevConfig";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

// Webpack Bundle Analyzer
// https://github.com/th0r/webpack-bundle-analyzer
export const getWebpackBundleAnalyzerPlugin = async (
  CWD: string,
  isDebug: boolean,
): Promise<webpack.Plugin[]> => {
  const rearguardLocalConfig = new RearguardDevConfig(CWD);
  const { webpack_bundle_analyzer } = await rearguardLocalConfig.getConfig();

  if (isDebug) {
    return [new BundleAnalyzerPlugin(webpack_bundle_analyzer)];
  }

  return [];
};
