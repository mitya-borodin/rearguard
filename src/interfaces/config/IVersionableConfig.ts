import { IConfig } from "./IConfig";

export interface IVersionableConfig extends IConfig {
  pkg: { [key: string]: any };
}
