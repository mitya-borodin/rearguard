import * as fs from "fs";
import * as path from "path";
import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";

export class PostcssPlugins implements IMetaFile {
  public init() {
    fs.copyFileSync(path.resolve(__dirname, "postcss.config.js"), path.resolve(process.cwd(), "postcss.config.js"));
  }
}
