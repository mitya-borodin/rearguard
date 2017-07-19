import path from 'path';
import { host, port, proxy, serverWasRunDetectString, } from '../../configs/prepare.build-tools.config';
import { writeFile } from '../lib/fs';

async function makeServerConfig (output) {
  await writeFile(path.resolve(output, 'config.json'), JSON.stringify({
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
}

export default makeServerConfig;
