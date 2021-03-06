import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import safePostCssParser from "postcss-safe-parser";
import webpack from "webpack";

export const getOptimizeCSSAssetsPlugin = (
  isDevelopment: boolean,
  isDebug: boolean,
): webpack.Plugin[] => {
  if (!isDevelopment) {
    return [
      // https://github.com/NMFR/optimize-css-assets-webpack-plugin
      // This is only used in production mode
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          // https://github.com/postcss/postcss-safe-parser
          parser: safePostCssParser,
          map: isDebug
            ? {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true,
              }
            : false,
        },
        cssProcessorPluginOptions: {
          preset: ["default", { minifyFontValues: { removeQuotes: false } }],
        },
      }),
    ];
  }

  return [];
};
