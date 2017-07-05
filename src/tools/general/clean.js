import path from 'path';
import { isIsomorphic, output, outputServer } from '../../configs/prepare.build-tools.config';
import { cleanDir } from '../lib/fs';

function clean () {
  return Promise.all([
    cleanDir(
      path.resolve(isIsomorphic ? outputServer : output.path, '*'),
      {
        nosort: true,
        dot: true,
        ignore: [path.resolve(output.path, '.git')],
      },
    ),
  ]);
}

export default clean;
