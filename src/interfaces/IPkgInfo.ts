import { IVersionableConfig } from "./IVersionableConfig";

export interface IPkgInfo extends IVersionableConfig {
  name: string;
  engines: { [key: string]: any };
  nodeVersion: number;
  dependencies: { [key: string]: string };
}
