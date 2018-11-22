import * as fs from "fs";
import * as path from "path";

export class EditorConfig {
  public init() {
    fs.copyFileSync(path.resolve(__dirname, ".editorconfig"), path.resolve(process.cwd(), ".editorconfig"));
  }
}
