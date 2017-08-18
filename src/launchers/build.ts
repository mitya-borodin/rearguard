import bundle from './bundle';
import clean from './clean';
import copy from './copy';

async function build() {
  await clean();
  await copy();
  await bundle();
}

export default build;
