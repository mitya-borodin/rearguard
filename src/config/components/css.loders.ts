import * as webpack from "webpack";
import {context, isDebug, isDevelopment, postCSS} from "./target.config";

export default (): webpack.Rule[] => {
  const style = [{loader: "isomorphic-style-loader"}];
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
        plugins: postCSS.config,
      },
    },
  ];

  return [
    {
      exclude: ["node_modules"],
      include: context,
      test: /\.css/,
      use: [...style, ...cssModules, ...postCss],
    },
    {
      exclude: [context],
      test: /\.css/,
      use: [...style, ...css, ...postCss],
    },
  ];
};
