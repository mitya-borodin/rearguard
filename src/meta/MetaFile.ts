import { isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { envConfig } from "../config/env";
import { IMetaFile } from "../interfaces/metaFile/IMetaFile";

export class MetaFile implements IMetaFile {
  private srcFile: string;
  private destFile: string;

  constructor(destFile: string, srcFile?: string) {
    this.destFile = destFile;
    this.srcFile = isString(srcFile) ? srcFile : destFile;
  }

  public init() {
    const src = path.resolve(__dirname, "../../../templates", this.srcFile);
    const dest = path.resolve(process.cwd(), this.destFile);
    const hasFile = fs.existsSync(dest);
    const { force } = envConfig;

    if (!hasFile || force) {
      fs.copyFileSync(src, dest);

      if (hasFile && force) {
        console.log(chalk.yellow(`[ META_FILE ][ FORCE_INIT ][ ${dest} ]`));
      }

      if (!hasFile) {
        console.log(chalk.green(`[ META_FILE ][ INIT ][ ${dest} ]`));
      }
    }
  }
}
