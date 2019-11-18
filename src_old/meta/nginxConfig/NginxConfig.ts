import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";
import { MetaFile } from "../MetaFile";

export class NginxConfig extends MetaFile implements IMetaFile {
  constructor() {
    super("build/tmp.nginx.conf", "tmp.nginx.conf");
  }
}
