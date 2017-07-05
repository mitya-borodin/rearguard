import path from 'path';
import {
  context,
  dependencies,
  engines,
  host,
  isIsomorphic,
  outputServer,
  port,
  proxy,
  publicDirName,
  serverWasRunDetectString
} from '../../configs/prepare.build-tools.config';
import { copyDir, makeDir, writeFile } from '../lib/fs';

async function copy () {
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
    await writeFile(path.resolve(outputServer, 'config.json'), JSON.stringify({
      port,
      host,
      serverWasRunDetectString,
      proxy: Object.keys(proxy).map((key) => {
        return {
          route: key,
          target: proxy[key],
        };
      }),
    }, null, 2));
    await copyDir(path.resolve(context, `../${publicDirName}`), path.resolve(outputServer, publicDirName));
  } else {
    await copyDir(path.resolve(context, `../${publicDirName}`), path.resolve(outputServer));
  }
}

export default copy;
