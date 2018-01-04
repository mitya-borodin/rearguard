import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as webpack from "webpack";
import { context, isDebug, isDevelopment, output, postCSS } from "../target.config";

const use = (isExternal = false, isModules = false) => ([
  ...isDevelopment ? [{ loader: "style-loader" }] : [],
  {
    loader: "css-loader",
    options: {
      discardComments: {
        removeAll: true,
      },
      importLoaders: !isExternal ? 1 : 0,
      localIdentName: isDevelopment ? "[path][local]" : "[hash:base64:32]",
      // CSS Nano http://cssnano.co/options/
      minimize: !isDevelopment,
      // CSS Modules https://github.com/css-modules/css-modules
      modules: isModules,
      sourceMap: isDebug,
    },
  },
  ...!isExternal ? [{ loader: "postcss-loader", options: { plugins: postCSS.config } }] : [],
]);

const rules = (isExternal = false, isModules = true) => {
  if (isDevelopment) {
    return {
      use: use(isExternal, isModules),
    };
  }

  return {
    use: ExtractTextPlugin.extract({
      fallback: "style-loader",
      publicPath: output.publicPath,
      use: use(isExternal, isModules),
    }),
  };
};

export default (): webpack.Rule[] => ([
  {
    exclude: [/\.global\.css/],
    include: context,
    test: /\.css/,
    ...rules(),
  },
  {
    exclude: [context, /\.global\.css/],
    test: /\.css/,
    ...rules(true, false),
  },
  {
    include: context,
    test: /\.global\.css/,
    ...rules(true, false),
  },
]);
