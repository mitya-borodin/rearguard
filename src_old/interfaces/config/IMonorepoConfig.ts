import { IConfigFile } from "./IConfigFile";

export interface IMonorepoConfig extends IConfigFile {
  modules: string;
}
