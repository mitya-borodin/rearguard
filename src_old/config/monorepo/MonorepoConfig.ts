import { isString } from "util";
import { IMonorepoConfig } from "../../interfaces/config/IMonorepoConfig";
import { ConfigFile } from "../ConfigFile";

export class MonorepoConfig extends ConfigFile implements IMonorepoConfig {
  constructor() {
    super("monorepo.json");
  }

  protected get default_config(): { [key: string]: any } {
    return {
      modules: "modules",
    };
  }

  get modules(): string {
    const { modules } = this.config;

    if (isString(modules) && modules.length > 0) {
      return modules;
    }

    console.error("[ MONOREPO_CONFIG_FILE ][ MODULES ][ ERROR ][ modules should be not empty string ]");

    return "";
  }
}
