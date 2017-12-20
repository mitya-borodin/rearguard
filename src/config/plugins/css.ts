import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as webpack from "webpack";
import { isDevelopment } from "../target.config";

export const extractCSS = (): webpack.Plugin[] => {
  if (!isDevelopment) {
    return [
      new ExtractTextPlugin({ filename: "[name].[hash].css" }),
    ];
  }

  return [];
};
