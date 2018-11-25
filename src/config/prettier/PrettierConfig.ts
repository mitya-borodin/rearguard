import { IPrettierConfigFile } from "../../interfaces/config/IPrettierConfigFile";
import { ConfigFile } from "../ConfigFile";

// tslint:disable:variable-name

export class PrettierConfig extends ConfigFile implements IPrettierConfigFile {
  constructor() {
    super("prettierrc.json");
  }

  protected get default_config(): { [key: string]: any } {
    return {
      printWidth: 120,
      trailingComma: "all",
      // tslint:disable-next-line:object-literal-sort-keys
      arrowParens: "always",
    };
  }
}

// tslint:enable:variable-name
