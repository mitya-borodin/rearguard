import { IConfig } from "./IConfig";

export interface IPkgInfo extends IConfig {
  name: string;
  engines: { [key: string]: any };
  nodeVersion: number;
  dependencies: { [key: string]: string };
}
