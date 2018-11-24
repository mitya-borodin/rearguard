import * as fs from "fs";
import * as path from "path";
import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";

export class EditorConfig implements IMetaFile {
  public init() {
    fs.copyFileSync(path.resolve(__dirname, ".editorconfig"), path.resolve(process.cwd(), ".editorconfig"));
  }
}
