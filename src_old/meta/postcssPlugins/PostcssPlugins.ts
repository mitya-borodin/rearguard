import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";
import { MetaFile } from "../MetaFile";

export class PostcssPlugins extends MetaFile implements IMetaFile {
  constructor() {
    super("postcss.config.js");
  }
}
