import { IConfig } from "../../interfaces/IConfigs";
import config from "./build.config";
import env from "./env.config";
import pkg from "./pkg.info";
import socket from "./socket.config";

export default (): IConfig => ({
  ...config(),
  ...socket(),
  ...env(),
  ...pkg(),

});
