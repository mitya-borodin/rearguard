import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";
import { MetaFile } from "../MetaFile";

export class Npmrc extends MetaFile implements IMetaFile {
  constructor() {
    super(".npmrc");
  }
}
