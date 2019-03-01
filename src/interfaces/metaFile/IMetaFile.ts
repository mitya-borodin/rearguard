import { IEnvConfig } from "../config/IEnvConfig";

export interface IMetaFile {
  init(envConfig: IEnvConfig): void;
}
