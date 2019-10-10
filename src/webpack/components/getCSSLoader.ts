import * as path from "path";
import * as webpack from "webpack";
import { RearguardConfig } from "../../configs/RearguardConfig";

export const getCSSLoader = (
  CWD: string,
  isDevelopment: boolean,
  isDebug: boolean,
): webpack.Rule[] => {
  const rearguardConfig = new RearguardConfig(CWD);
  const contextPath = path.resolve(CWD, rearguardConfig.getContext());
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
        plugins: require(path.resolve(__dirname, "postcss.config.js")),
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
