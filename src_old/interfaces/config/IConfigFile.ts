import { IConfig } from "./IConfig";

export interface IConfigFile extends IConfig {
  config_path: string;

  init(): { [key: string]: any };
}
