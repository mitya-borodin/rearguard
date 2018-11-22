import * as fs from "fs";
import * as path from "path";

export class PrePublish {
  public init() {
    fs.copyFileSync(path.resolve(__dirname, "pre_publish.sh"), path.resolve(process.cwd(), "pre_publish.sh"));
  }
}
