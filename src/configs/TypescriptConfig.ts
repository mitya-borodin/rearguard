import * as fs from "fs";
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

  public init(): TypescriptConfig {
    this.setTS(new Typescript());

    return this;
  }

  public async setBaseUrl(baseUrl: string): Promise<TypescriptConfig> {
    const ts = await this.getTS();

    this.setTS({ ...ts, baseUrl });

    return this;
  }

  public async setModule(module: "commonjs" | "es6"): Promise<TypescriptConfig> {
    const ts = await this.getTS();

    this.setTS({ ...ts, module });

    return this;
  }

  public async setInclude(include: string[]): Promise<TypescriptConfig> {
    const ts = await this.getTS();

    this.setTS({ ...ts, include });

    return this;
  }

  public async setExclude(exclude: string[]): Promise<TypescriptConfig> {
    const ts = await this.getTS();

    await this.setTS({ ...ts, exclude });

    return this;
  }

  private async getTS(): Promise<Readonly<Typescript>> {
    if (fs.existsSync(this.file_path)) {
      const content_of_pkg_file = fs.readFileSync(this.file_path, { encoding: "utf-8" });

      try {
        return new Typescript(JSON.parse(content_of_pkg_file));
      } catch (error) {
        console.error(error);

        process.exit(1);
      }
    } else {
      return await this.setTS(new Typescript());
    }

    return new Typescript();
  }

  private async setTS(ts: Typescript): Promise<Readonly<Typescript>> {
    const typescript: Readonly<Typescript> = new Typescript(ts);

    await mkdir(path.dirname(this.file_path));

    try {
      fs.writeFileSync(this.file_path, JSON.stringify(typescript, null, 2), { encoding: "utf-8" });
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return typescript;
  }
}
