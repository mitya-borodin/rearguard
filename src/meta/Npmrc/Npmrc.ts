import * as fs from "fs";
import * as path from "path";

export class Npmrc {
  public init() {
    fs.copyFileSync(path.resolve(__dirname, ".npmrc"), path.resolve(process.cwd(), ".npmrc"));
  }
}
