import * as fs from "fs";
import { merge } from "lodash";
import * as path from "path";
import { TS_CONFIG_FILE_NAME } from "../const";
import { mkdir } from "../helpers/mkdir";
import { Typescript } from "./Typescript";

export class TypescriptConfig {
  private CWD: string;
  private file_name: string;
  private file_path: string;

  constructor(CWD: string = process.cwd()) {
    this.CWD = CWD;
    this.file_name = TS_CONFIG_FILE_NAME;
    this.file_path = path.resolve(this.CWD, this.file_name);
  }

  public async init(force = false): Promise<void> {
    await this.setTS(new Typescript(), force);
  }

  public async setBaseUrl(baseUrl: string): Promise<void> {
    const ts = await this.getTS();

    await this.setTS(Typescript.merge(ts, { baseUrl }, {}));
  }

  public async setModule(module: "commonjs" | "es6"): Promise<void> {
    const ts = await this.getTS();

    await this.setTS(Typescript.merge(ts, { module }, {}));
  }

  public async setInclude(include: string[]): Promise<void> {
    const ts = await this.getTS();

    await this.setTS(Typescript.merge(ts, {}, { include }));
  }

  public async setExclude(exclude: string[]): Promise<void> {
    const ts = await this.getTS();

    await this.setTS(Typescript.merge(ts, {}, { exclude }));
  }

  private async getTS(): Promise<Readonly<Typescript>> {
    if (fs.existsSync(this.file_path)) {
      return new Typescript(this.read());
    } else {
      return await this.write(new Typescript());
    }
  }

  private async setTS(target: Readonly<Typescript>, force = false): Promise<Readonly<Typescript>> {
    try {
      if (force) {
        await this.write(target);
      } else {
        const origin = await this.getTS();
        const ts = new Typescript(merge(origin, target));

        await this.write(ts);
      }
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return target;
  }

  private read(): object {
    try {
      if (fs.existsSync(this.file_path)) {
        return JSON.parse(fs.readFileSync(this.file_path, { encoding: "utf-8" }));
      }
    } catch (error) {
      process.exit(1);
    }

    return {};
  }

  private async write(origin: Readonly<Typescript>): Promise<Readonly<Typescript>> {
    try {
      await mkdir(path.dirname(this.file_path));

      fs.writeFileSync(this.file_path, JSON.stringify(origin, null, 2), { encoding: "utf-8" });
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return origin;
  }
}
