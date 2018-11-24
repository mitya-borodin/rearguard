import * as path from "path";
import * as webpack from "webpack";
import { envConfig } from "../../config/env";
import { get_context } from "../../helpers";

export default (): webpack.Rule[] => {
  const { isDebug, isDevelopment } = envConfig;
  const style = [{ loader: "isomorphic-style-loader" }];
  const css = [
    {
      loader: "css-loader",
      options: {
        discardComments: {
          removeAll: true,
        },
        ident: "css",
        // CSS Nano http://cssnano.co/options/
        minimize: !isDevelopment,
        // CSS Modules https://github.com/css-modules/css-modules
        sourceMap: isDebug,
      },
    },
  ];
  const cssModules = [
    {
      loader: "css-loader",
      options: {
        discardComments: {
          removeAll: true,
        },
        ident: "css-modules",
        importLoaders: 1,
        localIdentName: isDevelopment ? "[path][local][hash:base64:4]" : "[hash:base64:32]",
        // CSS Nano http://cssnano.co/options/
        minimize: !isDevelopment,
        // CSS Modules https://github.com/css-modules/css-modules
        modules: true,
        sourceMap: isDebug,
      },
    },
  ];
  const postCss = [
    {
      loader: "postcss-loader",
      options: {
        ident: "postcss",
        plugins: require(path.resolve(__dirname, "../../components", "postcss.config.js")),
      },
    },
  ];

  return [
    {
      exclude(modulePath) {
        return /node_modules/.test(modulePath);
      },
      include: get_context(),
      test: /\.css/,
      use: [...style, ...cssModules, ...postCss],
    },
    {
      exclude: get_context(),
      test: /\.css/,
      use: [...style, ...css],
    },
  ];
};
