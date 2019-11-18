import { ITSLintConfigFile } from "../../interfaces/config/ITSLintConfigFile";
import { ConfigFile } from "../ConfigFile";

export class TSLintConfig extends ConfigFile implements ITSLintConfigFile {
  constructor() {
    super("tslint.json");
  }

  protected get default_config(): { [key: string]: any } {
    return {
      defaultSeverity: "error",
      extends: ["tslint:recommended"],
      jsRules: {},
      rules: {
        "no-console": [false],
        "object-literal-sort-keys": [false],
        "max-line-length": [true, 120],
      },
      rulesDirectory: [],
    };
  }
}
