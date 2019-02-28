import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";

export class MonorepoGitIgnore implements IMetaFile {
  constructor() {
    // BINDS
    this.init = this.init.bind(this);
  }

  public init(envConfig: IEnvConfig, force = false) {
    const dest = path.resolve(process.cwd(), ".gitignore");
    const hasFile = fs.existsSync(dest);
    const gitignore = ["registry_credentials.json"];

    if (!hasFile || envConfig.force || force) {
      fs.writeFileSync(path.resolve(process.cwd(), ".gitignore"), gitignore.join("\r\n"));

      if (hasFile && (envConfig.force || force)) {
        console.log(chalk.yellow(`[ META_FILE ][ FORCE_INIT ][ ${dest} ]`));
      }

      if (!hasFile) {
        console.log(chalk.green(`[ META_FILE ][ CREATE ][ ${dest} ]`));
      }
    }
  }
}
