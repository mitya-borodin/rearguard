import { IConfigFile } from "./IConfigFile";

export interface IRegistryCredentialsConfig extends IConfigFile {
  login: string;
  password: string;
}
