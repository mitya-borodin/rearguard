import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as webpack from "webpack";
import {isDevelopment} from "../target.config";

export const extractCSS = (dll = false): webpack.Plugin[] => {
  if (!isDevelopment) {
    return [
      new ExtractTextPlugin({filename: (dll ? "dll.[name]." : "") + "[hash].css"}),
    ];
  }

  return [];
};
