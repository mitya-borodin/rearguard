import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { isDevelopment, isIsomorphic } from '../target.config';

export const extractCSS = () => {
  if (!isIsomorphic && !isDevelopment) {
    return [
      new ExtractTextPlugin({ filename: '[name].[hash].css' }),
    ];
  }
  
  return [];
};
