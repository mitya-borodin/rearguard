import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";
import { PRETTIER_JSON } from "../const";
import { mkdir } from "../helpers/mkdir";
import { RearguardLocal } from "./RearguardLocal";

export class RearguardLocalConfig {
  private CWD: string;
  private file_name: string;
  private file_path: string;

  constructor(CWD: string = process.cwd()) {
    this.CWD = CWD;
    this.file_name = ".rearguardrc";
    this.file_path = path.resolve(this.CWD, this.file_name);
  }

  public getConfig(): Readonly<RearguardLocal> {
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

  public async setConfig(config: Readonly<RearguardLocal>): Promise<Readonly<RearguardLocal>> {
    const newConfig: Readonly<RearguardLocal> = new RearguardLocal(config);

    try {
      const content = prettier.format(JSON.stringify(newConfig), PRETTIER_JSON);

      await mkdir(this.file_path);

      fs.writeFileSync(this.file_path, content, { encoding: "utf-8" });
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return newConfig;
  }
}
