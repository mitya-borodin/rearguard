import { IConfig } from '../../interfaces/IConfigs';
import env from './env.config';
import pkg from './pkg.info';
import config from './prepare.rearguard.config';
import socket from './socket.config';

export default (): IConfig => ({
  ...config(),
  ...socket(),
  ...env(),
  ...pkg()
  
})
