import * as fs from "fs";
import * as path from "path";
import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";

export class DockerIgnore implements IMetaFile {
  public init() {
    fs.copyFileSync(path.resolve(__dirname, ".dockerignore"), path.resolve(process.cwd(), ".dockerignore"));
  }
}
