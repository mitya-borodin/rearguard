import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";
import { MetaFile } from "../MetaFile";

export class EditorConfig extends MetaFile implements IMetaFile {
  constructor() {
    super(".editorconfig");
  }
}
