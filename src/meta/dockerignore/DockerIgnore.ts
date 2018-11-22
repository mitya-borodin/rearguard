import * as fs from "fs";
import * as path from "path";

export class DockerIgnore {
  public init() {
    fs.copyFileSync(path.resolve(__dirname, ".dockerignore"), path.resolve(process.cwd(), ".dockerignore"));
  }
}
