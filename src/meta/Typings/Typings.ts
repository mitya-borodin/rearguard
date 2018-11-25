import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { envConfig } from "../../config/env";
import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";
import { MetaFile } from "../MetaFile";

export class Typings extends MetaFile implements IMetaFile {
  constructor() {
    super("src/typings.d.ts", "typings.d.ts");
  }
}
