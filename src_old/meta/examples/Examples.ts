import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";
import { MetaFile } from "../MetaFile";

export class Examples extends MetaFile implements IMetaFile {
  constructor() {
    super("examples/docker-compose.yml", "docker-compose.yml");
  }
}
