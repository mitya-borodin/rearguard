import { isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { IEnvConfig } from "../interfaces/config/IEnvConfig";
import { IMetaFile } from "../interfaces/metaFile/IMetaFile";

export class MetaFile implements IMetaFile {
  protected srcFile: string;
  protected destFile: string;

  constructor(destFile: string, srcFile?: string) {
    this.destFile = destFile;
    this.srcFile = isString(srcFile) ? srcFile : destFile;
  }

  public init(envConfig: IEnvConfig, force = false) {
    const src = path.resolve(__dirname, "../../../templates", this.srcFile);
    const dest = path.resolve(process.cwd(), this.destFile);
    const hasFile = fs.existsSync(dest);

    mkdirp.sync(path.dirname(dest));

    if (!hasFile || envConfig.force || force) {
      fs.copyFileSync(src, dest);

      if (hasFile && (envConfig.force || force)) {
        console.log(chalk.yellow(`[ META_FILE ][ FORCE_INIT ][ ${dest} ]`));
      }

      if (!hasFile) {
        console.log(chalk.green(`[ META_FILE ][ INIT ][ ${dest} ]`));
      }
    }
  }
}
