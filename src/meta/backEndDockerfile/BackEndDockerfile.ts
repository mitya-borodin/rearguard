import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";
import { MetaFile } from "../MetaFile";

export class BackEndDockerfile extends MetaFile implements IMetaFile {
  constructor() {
    super("build/Dockerfile", "back_end.Dockerfile");
  }
}
