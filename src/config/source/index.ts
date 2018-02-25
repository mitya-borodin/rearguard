import {IConfig} from "../../interfaces/IConfigs";
import config from "./build.config";
import env from "./env.config";
import pkg from "./pkg.info";
import socket from "./socket.config";

export default (): IConfig => {
  const {proxy: versifying, ...buildConfig} = config();
  const {proxy: unVersifying, ...socketConfig} = socket();

  return {
    ...buildConfig,
    ...socketConfig,
    proxy: {...versifying, ...unVersifying},
    ...env(),
    ...pkg(),
  };
};
