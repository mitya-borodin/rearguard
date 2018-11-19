import { NonVersionableConfig } from "../config/NonVersionableConfig";

export interface IWDSConfig extends NonVersionableConfig {
  host: string;
  port: number;
  proxy: { [key: string]: any };
}
