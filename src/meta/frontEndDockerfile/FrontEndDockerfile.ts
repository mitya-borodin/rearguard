import { IMetaFile } from "../../interfaces/metaFile/IMetaFile";
import { MetaFile } from "../MetaFile";

export class FrontEndDockerfile extends MetaFile implements IMetaFile {
  constructor() {
    super("build/Dockerfile", "front_end.Dockerfile");
  }
}
