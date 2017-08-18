import { devServer } from './target.config';

export default {
  ...devServer,
  compress: true,
  historyApiFallback: true,
  hot: true,
  overlay: {
    errors: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  clientLogLevel: 'info',
};
