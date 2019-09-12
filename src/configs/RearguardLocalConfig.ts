import * as fs from "fs";
import * as path from "path";
import * as PPJ from "prettier-package-json";
import { IRearguardLocal } from "../interface/configs/IRearguardLocal";
import { IRearguardLocalConfig } from "../interface/configs/IRearguardLocalConfig";
import { RearguardLocal } from "./RearguardLocal";

export class RearguardLocalConfig implements IRearguardLocalConfig {
  private CWD: string;
  private file_name: string;
  private file_path: string;

  constructor(CWD: string = process.cwd()) {
    this.CWD = CWD;
    this.file_name = ".rearguardrc";
    this.file_path = path.resolve(this.CWD, this.file_name);
  }

  public getConfig(): Readonly<IRearguardLocal> {
    if (fs.existsSync(this.file_path)) {
      const content_of_rc_file = fs.readFileSync(this.file_path, { encoding: "utf-8" });

      try {
        return new RearguardLocal(JSON.parse(content_of_rc_file));
      } catch (error) {
        console.error(error);

        process.exit(1);
      }
    } else {
      console.error(`File ${this.file_path} not found`);

      process.exit(1);
    }

    return new RearguardLocal({});
  }

  public setConfig(config: IRearguardLocal): Readonly<IRearguardLocal> {
    const newConfig: Readonly<IRearguardLocal> = new RearguardLocal(config);

    try {
      if (fs.existsSync(this.file_path)) {
        fs.writeFileSync(this.file_path, PPJ.format(newConfig), { encoding: "utf-8" });
      } else {
        console.error(`File ${this.file_path} not found`);

        process.exit(1);
      }
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return newConfig;
  }
}
