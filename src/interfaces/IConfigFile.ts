export interface IConfigFile {
  config: { [key: string]: any };

  init(): { [key: string]: any };
}
