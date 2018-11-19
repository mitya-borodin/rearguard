import { ITSLintConfigFile } from "../../interfaces/ITSLintConfigFile";
import { ConfigFile } from "../ConfigFile";

// tslint:disable:variable-name

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
        "max-classes-per-file": [false],
        "member-access": true,
        "no-console": false,
        "no-var-requires": false,
        "variable-name": false,
      },
      rulesDirectory: [],
    };
  }
}

// tslint:enable:variable-name
