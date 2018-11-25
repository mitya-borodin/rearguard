import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";
import { MetaFile } from "../MetaFile";

export class DockerIgnore extends MetaFile implements IMetaFile {
  constructor() {
    super(".dockerignore");
  }
}
