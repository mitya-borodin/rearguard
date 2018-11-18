import { VersionableConfigFile } from "../VersionableConfigFile";

// tslint:disable:variable-name

export class TSLintConfig extends VersionableConfigFile {
  constructor() {
    super("tslint.json", {
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
    });
  }
}

// tslint:enable:variable-name
