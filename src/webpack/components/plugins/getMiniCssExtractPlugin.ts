import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { RearguardConfig } from "../../../configs/RearguardConfig";

export const getMiniCssExtractPlugin = (CWD: string, isDevelopment: boolean): webpack.Plugin[] => {
  const rearguardConfig = new RearguardConfig(CWD);
  const [, useOnlyIsomorphicStyleLoader] = rearguardConfig.getCSS();

  if (!isDevelopment && !useOnlyIsomorphicStyleLoader) {
    return [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].[hash:8].css",
        chunkFilename: "[name].[hash:8].chunk.css",
      }),
    ];
  }

  return [];
};
