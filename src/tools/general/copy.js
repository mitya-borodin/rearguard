import path from 'path';
import {
  context,
  dependencies,
  engines,
  isIsomorphic,
  outputServer,
  publicDirName,
} from '../../configs/prepare.build-tools.config';
import { copyDir, makeDir, writeFile } from '../lib/fs';
import makeServerConfig from './makeServerConfig';

async function copy() {
  if (isIsomorphic) {
    await makeDir(outputServer);
    await writeFile(path.resolve(outputServer, 'package.json'), JSON.stringify({
      private: true,
      engines,
      dependencies,
      scripts: {
        start: 'node server.js',
      },
    }, null, 2));
    await makeServerConfig(outputServer);
    await copyDir(path.resolve(context, `../${publicDirName}`), path.resolve(outputServer, publicDirName));
  } else {
    await copyDir(path.resolve(context, `../${publicDirName}`), path.resolve(outputServer));
  }
}

export default copy;
