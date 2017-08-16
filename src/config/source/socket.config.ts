import * as fs from 'fs';
import * as path from 'path';
import { ISocket } from '../../interfaces/IConfigs';
import socket, { defaultValue } from '../validate-config/socket';

export default (fileName = 'socket.config.json'): ISocket => {
  const CWD = process.cwd();
  const configPath = path.resolve(CWD, fileName);
  
  if (fs.existsSync(configPath)) {
    return socket(JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8' })));
  } else {
    fs.writeFileSync(configPath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
}
