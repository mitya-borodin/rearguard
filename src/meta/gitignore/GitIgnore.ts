import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { envConfig } from "../../config/env";
import { IRearguardConfig } from "../../interfaces/config/IRearguardConfig";
import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";

export class GitIgnore implements IMetaFile {
  private rearguardConfig: IRearguardConfig;

  constructor(rearguardConfig: IRearguardConfig) {
    // DEPS
    this.rearguardConfig = rearguardConfig;

    // BINDS
    this.init = this.init.bind(this);
  }

  public init() {
    const dest = path.resolve(process.cwd(), ".gitignore");
    const { force } = envConfig;
    const hasFile = fs.existsSync(dest);
    let gitignore = [`node_modules`];

    if (!this.rearguardConfig.publish_in_git) {
      gitignore.push("dll_bundle");
      gitignore.push("lib_bundle");
      gitignore.push("lib");
    }

    gitignore = gitignore.concat([
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
    ]);

    if (!hasFile || force) {
      fs.writeFileSync(path.resolve(process.cwd(), ".gitignore"), gitignore.join("\r\n"));

      if (hasFile && force) {
        console.log(chalk.yellow(`[ META_FILE ][ FORCE_INIT ][ ${dest} ]`));
      }

      if (!hasFile) {
        console.log(chalk.green(`[ META_FILE ][ CREATE ][ ${dest} ]`));
      }
    }
  }
}
