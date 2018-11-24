import * as fs from "fs";
import * as path from "path";
import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";

export class PrePublish implements IMetaFile {
  public init() {
    fs.copyFileSync(path.resolve(__dirname, "pre_publish.sh"), path.resolve(process.cwd(), "pre_publish.sh"));
  }
}
