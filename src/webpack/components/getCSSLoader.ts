/* eslint-disable @typescript-eslint/no-var-requires */
import { isArray } from "@borodindmitriy/utils";
import fs from "fs";
import path from "path";
import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { RearguardConfig } from "../../configs/RearguardConfig";

export const getCSSLoader = (
  CWD: string,
  isDevelopment: boolean,
  isDebug: boolean,
): webpack.Rule[] => {
  const rearguardConfig = new RearguardConfig(CWD);
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
  const browserslist = rearguardConfig.getBrowserslist();
  const [
    filenameWithExternalPostCSSPlugins,
    useOnlyIsomorphicStyleLoader,
  ] = rearguardConfig.getCSS();
  // * This is file should export array with plugins
  const externalPostCSSPluginsPath = path.resolve(CWD, filenameWithExternalPostCSSPlugins);

  let externalPostCSSPlugins: any[] = [];

  if (fs.existsSync(externalPostCSSPluginsPath)) {
    const result: any = require(externalPostCSSPluginsPath);

    if (isArray(result)) {
      externalPostCSSPlugins = result;
    }
  }

  const style = { loader: "style-loader" };

  const isomorphicStyle = { loader: "isomorphic-style-loader" };

  const getCSSLoader = (options: { [key: string]: any } = {}): { [key: string]: any } => {
    return {
      loader: "css-loader",
      options: {
        sourceMap: isDebug,
        ...options,
      },
    };
  };

  const postCss = {
    loader: "postcss-loader",
    options: {
      // Necessary for external CSS imports to work
      // https://github.com/facebook/create-react-app/issues/2677
      ident: "postcss",
      plugins: (): any[] => [
        // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
        // https://github.com/postcss/postcss-import
        require("postcss-import")({ path: contextPath }),

        // Postcss flexbox bug fixer
        // https://github.com/luisrudge/postcss-flexbugs-fixes
        require("postcss-flexbugs-fixes")(),

        // https://github.com/MadLittleMods/postcss-css-variables
        require("postcss-css-variables")(),

        // Postcss flexbox bug fixer
        // https://github.com/luisrudge/postcss-flexbugs-fixes
        require("postcss-flexbugs-fixes")(),

        // https://github.com/csstools/postcss-preset-env
        require("postcss-preset-env")({
          features: {
            ["case-insensitive-attributes"]: true,
            ["all-property"]: {
              reset: "inherited",
            },
            ["color-functional-notation"]: true,
            ["custom-media-queries"]: true,
            ["media-query-ranges"]: true,
            ["nesting-rules"]: true,
            ["custom-properties"]: true,
          },
          autoprefixer: {
            flexbox: "no-2009",
            overrideBrowserslist: browserslist,
          },
          stage: 3,
          browsers: browserslist,
        }),

        // https://github.com/csstools/postcss-normalize
        require("postcss-normalize")({ browsers: browserslist }),

        ...externalPostCSSPlugins,
      ],
    },
  };

  const sass = [
    {
      loader: "resolve-url-loader",
      options: {
        sourceMap: isDebug,
      },
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: isDebug,
      },
    },
  ];

  const localIdentName = (isDevelopment: boolean): any => {
    return isDevelopment ? "[path][local][hash:base64:4]" : "[hash:base64:32]";
  };

  if (useOnlyIsomorphicStyleLoader) {
    const cssIsomorphicRegex = /\.css$/;
    const sassIsomorphicRegex = /\.(scss|sass)$/;

    const cssIsomorphicModuleRegex = /\.module\.css$/;
    const sassIsomorphicModuleRegex = /\.module\.(scss|sass)$/;

    return [
      // ! ISOMORPHIC-STYLE-LOADER - CSS-LOADER
      {
        test: cssIsomorphicRegex,
        exclude: cssIsomorphicModuleRegex,
        use: [isomorphicStyle, getCSSLoader({ importLoaders: 1 }), postCss],
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
      {
        test: sassIsomorphicRegex,
        exclude: sassIsomorphicModuleRegex,
        use: [isomorphicStyle, getCSSLoader({ importLoaders: 2 }), postCss, ...sass],
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },

      // ! ISOMORPHIC-STYLE-LOADER - CSS-MODULES-LOADER
      {
        test: cssIsomorphicModuleRegex,
        use: [
          isomorphicStyle,
          getCSSLoader({
            importLoaders: 1,
            modules: { localIdentName: localIdentName(isDevelopment) },
          }),
          postCss,
        ],
      },
      {
        test: sassIsomorphicModuleRegex,
        use: [
          isomorphicStyle,
          getCSSLoader({
            importLoaders: 2,
            modules: { localIdentName: localIdentName(isDevelopment) },
          }),
          postCss,
          ...sass,
        ],
      },
    ];
  } else {
    const cssRegex = /\.css$/;
    const sassRegex = /\.(scss|sass)$/;

    const cssModuleRegex = /\.module\.css$/;
    const sassModuleRegex = /\.module\.(scss|sass)$/;

    return [
      // ! STYLE-LOADER - CSS-LOADER
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: [
          ...(isDevelopment ? [style] : [MiniCssExtractPlugin.loader]),
          getCSSLoader({ importLoaders: 1 }),
          postCss,
        ],
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: [
          ...(isDevelopment ? [style] : [MiniCssExtractPlugin.loader]),
          getCSSLoader({ importLoaders: 2 }),
          postCss,
          ...sass,
        ],
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },

      // ! STYLE-LOADER - CSS-MODULES-LOADER
      {
        test: cssModuleRegex,
        use: [
          ...(isDevelopment ? [style] : [MiniCssExtractPlugin.loader]),
          getCSSLoader({
            importLoaders: 1,
            modules: { localIdentName: localIdentName(isDevelopment) },
          }),
          postCss,
        ],
      },
      {
        test: sassModuleRegex,
        use: [
          ...(isDevelopment ? [style] : [MiniCssExtractPlugin.loader]),
          getCSSLoader({
            importLoaders: 2,
            modules: { localIdentName: localIdentName(isDevelopment) },
          }),
          postCss,
          ...sass,
        ],
      },
    ];
  }
};
