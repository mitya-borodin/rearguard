import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { isIsomorphic, isProduction } from '../../prepare.build-tools.config';

export const extractCSS = () => {
  if (!isIsomorphic && isProduction) {
    return [
      new ExtractTextPlugin({ filename: '[name].[hash].css', ignoreOrder: true },
      ),
    ];
  }

  return [];
};
