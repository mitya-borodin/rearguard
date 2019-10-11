import * as TerserWebpackPlugin from "terser-webpack-plugin";
import * as webpack from "webpack";

export const getTerserWebpackPlugin = (isDevelopment: boolean): webpack.Plugin[] => {
  if (!isDevelopment) {
    return [
      // https://github.com/webpack-contrib/terser-webpack-plugin
      new TerserWebpackPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          compress: {
            sequences: true,
            unused: true,
          },
          ecma: 8,
        },
      }),
    ];
  }

  return [];
};
