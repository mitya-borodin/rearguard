import { devServer, proxy } from '../prepare.build-tools.config';

const proxyWDS = {};

for (let from in proxy) {
  if (proxy.hasOwnProperty(from)) {
    proxyWDS[`${from}/**`] = {
      target: proxy[from],
      secure: false,
      changeOrigin: true,
    };
  }
}

export default {
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
  proxy: proxyWDS,
};
