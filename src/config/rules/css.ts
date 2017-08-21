import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { context, isDevelopment, isIsomorphic, output, postCSSConfigPath, } from '../target.config';

const use = (isExternal = false) => {
  let styleLoader: any[] = [];
  
  if (isIsomorphic) {
    styleLoader = [
      {
        loader: 'isomorphic-style-loader',
      },
    ];
  }
  
  return [
    ...styleLoader,
    {
      loader: 'css-loader',
      options: {
        ...!isExternal
          ? {
            // CSS Loader https://webpack.js.org/loaders/css-loader/
            importLoaders: 1,
            localIdentName: isDevelopment ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:32]',
          }
          : {},
        // CSS Modules https://github.com/css-modules/css-modules
        modules: !isExternal,
        sourceMap: isDevelopment,
        // CSS Nano http://cssnano.co/options/
        minimize: !isDevelopment,
        discardComments: {
          removeAll: true,
        },
      },
    },
    ...!isExternal
      ? [
        {
          loader: 'postcss-loader',
          options: {
            plugins: postCSSConfigPath,
          },
        },
      ]
      : [],
  ];
};

const rules = (isExternal = false) => ({
  ...!isIsomorphic && !isDevelopment
    ? {
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: use(isExternal),
        publicPath: output.publicPath,
      }),
    }
    : {
      use: use(isExternal),
    },
});

export const internalCSS = (test = /\.css/) => ({
  test,
  include: context,
  ...rules(false),
});

export const externalCSS = (test = /\.css/) => ({
  test,
  exclude: context,
  ...rules(true),
});
