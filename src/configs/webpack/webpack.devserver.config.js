import { devServer, proxy } from '../prepare.build-tools.config';

export default  {
  ...devServer,
  compress: true,
  historyApiFallback: true,
  hot: true,
  https: false,
  inline: true,
  overlay: {
    errors: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  clientLogLevel: 'info',
  proxy,
};
