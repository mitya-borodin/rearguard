import webpackConfig from '../../configs/webpack/react.webpack.config';
import bundle from '../general/bundle';
import clean from '../general/clean';
import copy from '../general/copy';
import run from '../run';

async function build () {
  await run(clean, 'clean.react.app');
  await run(copy, 'copy.react.app');
  await run(async () => await bundle(webpackConfig), 'bundle.react.app');
}

run(build, 'build.react.app');
