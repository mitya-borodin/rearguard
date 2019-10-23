import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";
import { PRETTIER_JSON, TS_CONFIG_FILE_NAME } from "../const";
import { mkdir } from "../helpers/mkdir";
import { Typescript } from "./Typescript";

export class TypescriptConfig {
  private CWD: string;
  private file_name: string;
  private file_path: string;

  constructor(CWD: string = process.cwd(), file_name = TS_CONFIG_FILE_NAME) {
    this.CWD = CWD;
    this.file_name = file_name;
    this.file_path = path.resolve(this.CWD, this.file_name);
  }

  public async init(force = false): Promise<Readonly<Typescript>> {
    const origin = new Typescript();

    if (!fs.existsSync(this.file_path)) {
      return await this.write(origin);
    } else if (force) {
      return await this.write(origin);
    }

    return origin;
  }

  public async setBaseUrl(baseUrl: string): Promise<void> {
    const origin = await this.read();

    await this.write(Typescript.merge(origin, { baseUrl }, {}));
  }

  public async setModule(module: "commonjs" | "es6"): Promise<void> {
    const origin = await this.read();

    await this.write(Typescript.merge(origin, { module }, {}));
  }

  public async setTypes(types: string[]): Promise<void> {
    const origin = await this.read();

    await this.write(Typescript.merge(origin, { types }, {}));
  }

  public async setInclude(include: string[]): Promise<void> {
    const origin = await this.read();

    await this.write(Typescript.merge(origin, {}, { include }));
  }

  public async setExclude(exclude: string[]): Promise<void> {
    const origin = await this.read();

    await this.write(Typescript.merge(origin, {}, { exclude }));
  }

  private async read(): Promise<Readonly<Typescript>> {
    try {
      if (fs.existsSync(this.file_path)) {
        const origin = JSON.parse(fs.readFileSync(this.file_path, { encoding: "utf-8" }));

        return new Typescript(origin);
      } else {
        return await this.init();
      }
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return new Typescript();
  }

  private async write(origin: Readonly<Typescript>): Promise<Readonly<Typescript>> {
    try {
      const content = prettier.format(JSON.stringify(origin), PRETTIER_JSON);

      mkdir(path.dirname(this.file_path));

      fs.writeFileSync(this.file_path, content, { encoding: "utf-8" });
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return origin;
  }
}
