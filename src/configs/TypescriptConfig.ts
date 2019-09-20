import * as fs from "fs";
import { defaultsDeep } from "lodash";
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

  public init(force = false): TypescriptConfig {
    this.setTS(new Typescript(), force);

    return this;
  }

  public async setBaseUrl(baseUrl: string): Promise<TypescriptConfig> {
    const ts = await this.getTS();

    this.setTS(Typescript.merge(ts, { baseUrl }));

    return this;
  }

  public async setModule(module: "commonjs" | "es6"): Promise<TypescriptConfig> {
    const ts = await this.getTS();

    this.setTS(Typescript.merge(ts, { module }));

    return this;
  }

  public async setInclude(include: string[]): Promise<TypescriptConfig> {
    const ts = await this.getTS();

    this.setTS(Typescript.merge(ts, {}, { include }));

    return this;
  }

  public async setExclude(exclude: string[]): Promise<TypescriptConfig> {
    const ts = await this.getTS();

    this.setTS(Typescript.merge(ts, {}, { exclude }));

    return this;
  }

  private async getTS(): Promise<Readonly<Typescript>> {
    if (fs.existsSync(this.file_path)) {
      return new Typescript(this.read());
    } else {
      return await this.setTS(new Typescript());
    }
  }

  private async setTS(target: Typescript, force = false): Promise<Readonly<Typescript>> {
    const origin: Readonly<Typescript> = await this.getTS();

    await mkdir(path.dirname(this.file_path));

    try {
      if (fs.existsSync(this.file_path)) {
        if (force) {
          this.write(target);
        } else {
          this.write(new Typescript(defaultsDeep(origin, target)));
        }
      } else {
        this.write(target);
      }
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return target;
  }

  private read(): object {
    try {
      return JSON.parse(fs.readFileSync(this.file_path, { encoding: "utf-8" }));
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return {};
  }

  private write(content: object): void {
    try {
      fs.writeFileSync(this.file_path, JSON.stringify(content, null, 2), { encoding: "utf-8" });
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  }
}
