import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as UglifyJSPlugin from "uglifyjs-webpack-plugin";
import * as webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { analyze as configAnalyze, env, isDebug, isDevelopment } from "../target.config";

export const HMR = (): webpack.Plugin[] => {
  if (isDevelopment) {
    return [
      new webpack.NamedModulesPlugin(),
      // prints more readable module names in the browser console on HMR updates

      new webpack.HotModuleReplacementPlugin(),
      // enable HMR globally
    ];
  }

  return [];
};

export const scopeHoisting = () => {
  return [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ];
};

// https://webpack.js.org/plugins/commons-chunk-plugin/
export const extractVendors = (): webpack.Plugin[] => ([
  new webpack.optimize.CommonsChunkPlugin({
    minChunks: (module) => module.context && module.context.indexOf("node_modules") !== -1,
    name: "vendor",
  }),
  new webpack.optimize.CommonsChunkPlugin({ name: "manifest" }),
]);

export const uglify = (): webpack.Plugin[] => {
  if (!isDevelopment) {
    return [
      // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
      new UglifyJSPlugin(
        {
          cache: true,
          parallel: true,
        },
      ),
    ];
  }

  return [];
};

// Webpack Bundle Analyzer
// https://github.com/th0r/webpack-bundle-analyzer
export const analyze = (): webpack.Plugin[] => {
  if (isDebug) {
    return [
      new BundleAnalyzerPlugin({
        analyzerPort: configAnalyze.port,
      }),
    ];
  }

  return [];
};

// https://webpack.js.org/plugins/define-plugin/
export const definePlugin = (): webpack.Plugin[] => ([
    new webpack.DefinePlugin({ "process.env.NODE_ENV": env.NODE_ENV }),
  ]
);

export const htmlWebpackPlugin = (): webpack.Plugin[] => {
  return [
    new HtmlWebpackPlugin({
      cache: true,
      filename: "index.html",
      inject: "head",
    }),
  ];
};
