import * as fs from "fs";
import * as path from "path";
import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";

export class Npmrc implements IMetaFile {
  public init() {
    fs.copyFileSync(path.resolve(__dirname, ".npmrc"), path.resolve(process.cwd(), ".npmrc"));
  }
}
