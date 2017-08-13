import run from '../run';
import bundle from './bundle';
import clean from './clean';
import copy from './copy';

async function build(webpackConfig) {
  await run(clean, 'clean');
  await run(copy, 'copy');
  await run(async () => await bundle(webpackConfig), 'bundle');
}

export default build;
