import generateTSConfig from '../../configs/generateTSConfig';
import { isTS } from '../../configs/prepare.build-tools.config';
import webpackConfig from '../../configs/webpack/inferno.webpack.config';
import start from '../general/start';

if (isTS) {
  generateTSConfig();
}

start(webpackConfig);
