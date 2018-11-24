import * as fs from "fs";
import * as path from "path";
import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";

export class TypingFileModule implements IMetaFile {
  public init() {
    fs.copyFileSync(
      path.resolve(__dirname, "typingFileModule.d.ts"),
      path.resolve(process.cwd(), "src/typingFileModule.d.ts"),
    );
  }
}
