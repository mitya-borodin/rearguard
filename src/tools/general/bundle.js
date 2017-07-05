import webpack from 'webpack';
import { devServer } from '../../configs/prepare.build-tools.config';

async function bundle (webpackConfig) {
  await new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      console.info(stats.toString(devServer.stats));
      return resolve();
    });
  });
}

export default bundle;
