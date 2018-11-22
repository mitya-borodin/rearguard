import * as fs from "fs";
import * as path from "path";

export class TypingFileModule {
  public init() {
    fs.copyFileSync(
      path.resolve(__dirname, "typingFileModule.d.ts"),
      path.resolve(process.cwd(), "src/typingFileModule.d.ts"),
    );
  }
}
