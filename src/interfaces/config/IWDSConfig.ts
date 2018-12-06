import { IConfig } from "./IConfig";

export interface IWDSConfig extends IConfig {
  host: string;
  port: number;
  proxy: { [key: string]: any };
}
