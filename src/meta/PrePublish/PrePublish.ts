import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";
import { MetaFile } from "../MetaFile";

export class PrePublish extends MetaFile implements IMetaFile {
  constructor() {
    super("pre_publish.sh");
  }
}
