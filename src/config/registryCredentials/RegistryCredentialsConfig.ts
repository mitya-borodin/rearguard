import { isString } from "util";
import { IRegistryCredentialsConfig } from "../../interfaces/config/IRegistryCredentialsConfig";
import { ConfigFile } from "../ConfigFile";

export class RegistryCredentialsConfig extends ConfigFile implements IRegistryCredentialsConfig {
  constructor() {
    super("registry_credentials.json");
  }

  protected get default_config(): { [key: string]: any } {
    return {
      publishConfig: {
        login: "",
        password: "",
      },
    };
  }

  get login(): string {
    const { login } = this.config.publishConfig;

    if (isString(login) && login.length > 0) {
      return login;
    }

    console.error("[ REGISTRY_CREDENTIALS ][ ERROR ][ login must be a not empty string; ]");
    return "";
  }

  get password(): string {
    const { password } = this.config.publishConfig;

    if (isString(password) && password.length > 0) {
      return password;
    }

    console.error("[ REGISTRY_CREDENTIALS ][ ERROR ][ password must be a not empty string; ]");
    return "";
  }
}
