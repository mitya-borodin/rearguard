import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import {context, isDevelopment, isIsomorphic, output, postCSSConfigPath} from "../target.config";

const use = (isExternal = false, isModules = false) => {
  let styleLoader: any[] = [];

  if (isDevelopment) {
    styleLoader = [
      {
        loader: "style-loader",
      },
    ];
  }

  if (isIsomorphic) {
    styleLoader = [
      {
        loader: "isomorphic-style-loader",
      },
    ];
  }

  return [
    ...styleLoader,
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
        sourceMap: isDevelopment,
      },
    },
    ...!isExternal
      ? [
        {
          loader: "postcss-loader",
          options: {
            plugins: postCSSConfigPath,
          },
        },
      ]
      : [],
  ];
};

const rules = (isExternal = false, isModules = true) => ({
  ...!isIsomorphic && !isDevelopment
    ? {
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        publicPath: output.publicPath,
        use: use(isExternal, isModules),
      }),
    }
    : {
      use: use(isExternal, isModules),
    },
});

export const internalCSS = (test = /\.css/) => ({
  exclude: [/\.global\.css/],
  include: context,
  test,
  ...rules(),
});

export const externalCSS = (test = /\.css/) => ({
  exclude: [context, /\.global\.css/],
  test,
  ...rules(true, false),
});

export const globalCSS = (test = /\.global\.css/) => ({
  include: context,
  test,
  ...rules(true, false),
});
