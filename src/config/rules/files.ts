import { isDevelopment } from '../target.config';

export const file = () => ({
  test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
  loader: 'file-loader',
  query: {
    name: isDevelopment ? '[path][name].[ext]?[hash:8]' : '[hash:32].[ext]',
  },
});
