import { IConfig } from "./IConfig";

export interface IConfigFile extends IConfig {
  init(): { [key: string]: any };
}
