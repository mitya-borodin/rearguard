import * as fs from "fs";
import * as path from "path";
import { IRearguardConfig } from "../../interfaces/config/IRearguardConfig";

export class GitIgnore {
  private rearguardConfig: IRearguardConfig;

  constructor(rearguardConfig: IRearguardConfig) {
    // DEPS
    this.rearguardConfig = rearguardConfig;

    // BINDS
    this.init = this.init.bind(this);
  }

  public init() {
    let gitignore = ["node_modules"];

    if (!this.rearguardConfig.publish_in_git) {
      gitignore.push("dll_bundle");
      gitignore.push("lib_bundle");
      gitignore.push("lib");
    }

    gitignore = [
      "dist",
      "readruard.json",
      "tsconfig.json",
      "tslint.json",
      "src/typings.d.ts",
      ".dockerignore",
      ".editorconfig",
      ".npmrc",
      "pre_publish.sh",
      "pre_publish_build_tmp",
    ];

    fs.writeFileSync(path.resolve(process.cwd(), ".gitignore"), gitignore.join("\n\r"));
  }
}
