/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from "fs";
import * as path from "path";
import * as webpack from "webpack";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { isArray } from "@borodindmitriy/utils";

export const getCSSLoader = (
  CWD: string,
  isDevelopment: boolean,
  isDebug: boolean,
): webpack.Rule[] => {
  const rearguardConfig = new RearguardConfig(CWD);
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());

  // * This is file should export array with plugins
  const externalPostCSSPluginsPath = path.resolve(
    process.cwd(),
    rearguardConfig.getFilenameWithExternalPostCSSPlugins(),
  );

  let externalPostCSSPlugins: any[] = [];

  if (fs.existsSync(externalPostCSSPluginsPath)) {
    const result: any = require(externalPostCSSPluginsPath);

    if (isArray(result)) {
      externalPostCSSPlugins = result;
    }
  }

  const style = [{ loader: "isomorphic-style-loader" }];
  const css = [
    {
      loader: "css-loader",
      options: {
        // CSS Modules https://github.com/css-modules/css-modules
        sourceMap: isDebug,
      },
    },
  ];
  const cssModules = [
    {
      loader: "css-loader",
      options: {
        importLoaders: 1,
        // CSS Modules https://github.com/css-modules/css-modules
        modules: {
          localIdentName: isDevelopment ? "[path][local][hash:base64:4]" : "[hash:base64:32]",
          mode: "local",
        },
        sourceMap: isDebug,
      },
    },
  ];
  const postCss = [
    {
      loader: "postcss-loader",
      options: {
        ident: "postcss",
        plugins: [
          // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
          // https://github.com/postcss/postcss-import
          require("postcss-import")({ path: contextPath }),

          // https://github.com/maximkoretskiy/postcss-initial
          // This is polyfill for css rule: "all: initial".
          // Указываем .className { all: initial } и вместо all: initial
          // будут вставлены значения по-молчанию для настедуемых свойств.
          require("postcss-initial")({ reset: "inherited" }),

          // W3C color() function, e.g. div { background: color(red alpha(90%)); }
          // https://github.com/postcss/postcss-color-function
          require("postcss-color-function")(),

          // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
          // https://github.com/postcss/postcss-custom-media
          require("postcss-custom-media")(),

          // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
          // https://github.com/postcss/postcss-media-minmax
          require("postcss-media-minmax")(),

          // Postcss flexbox bug fixer
          // https://github.com/luisrudge/postcss-flexbugs-fixes
          require("postcss-flexbugs-fixes")(),

          // Add vendor prefixes to CSS rules using values from caniuse.com
          // https://github.com/postcss/autoprefixer
          // TODO Add settings from browserList.
          require("autoprefixer")([">0.1%"]),
          // * This is file should export array with plugins

          ...externalPostCSSPlugins,
        ],
      },
    },
  ];

  return [
    {
      exclude(modulePath): boolean {
        return /node_modules/.test(modulePath);
      },
      include: contextPath,
      test: /\.css/,
      use: [...style, ...cssModules, ...postCss],
    },
    {
      exclude: contextPath,
      test: /\.css/,
      use: [...style, ...css],
    },
  ];
};
