import * as path from 'path';
import { context, dependencies, engines, isIsomorphic, publicDirName, servercOutput, } from '../config/target.config';
import { copyDir, makeDir, writeFile } from '../lib/fs';
import makeServerConfig from './makeServerConfig';

async function copy() {
  if (isIsomorphic) {
    await makeDir(servercOutput);
    await writeFile(path.resolve(servercOutput, 'package.json'), JSON.stringify({
      private: true,
      engines,
      dependencies,
      scripts: {
        start: 'node server.js',
      },
    }, null, 2));
    await makeServerConfig(servercOutput);
    await copyDir(path.resolve(context, `../${publicDirName}`), path.resolve(servercOutput, publicDirName));
  } else {
    await copyDir(path.resolve(context, `../${publicDirName}`), path.resolve(servercOutput));
  }
}

export default copy;
