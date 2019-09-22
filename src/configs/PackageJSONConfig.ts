import * as fs from "fs";
import * as path from "path";
import * as PPJ from "prettier-package-json";
import { DependencyMa, ScriptsMap } from "../interfaces/configs/PackageJSON";
import { PackageJSON } from "./PackageJSON";
import { Rearguard } from "./Rearguard";

export class PackageJSONConfig {
  private CWD: string;
  private file_name: string;
  private file_path: string;

  constructor(CWD: string = process.cwd()) {
    this.CWD = CWD;
    this.file_name = "package.json";
    this.file_path = path.resolve(this.CWD, this.file_name);
  }

  public getPkg(): Readonly<PackageJSON> {
    if (fs.existsSync(this.file_path)) {
      return new PackageJSON(this.read());
    } else {
      console.error(`File ${this.file_path} not found`);

      process.exit(1);
    }

    return new PackageJSON({});
  }

  public getName(): string {
    return this.getPkg().name;
  }

  public getVersion(): string {
    return this.getPkg().version;
  }

  public getFiles(): string[] {
    return this.getPkg().files;
  }

  public getDependencies(): Readonly<DependencyMa> {
    return this.getPkg().dependencies || {};
  }

  public getDependencyList(): string[] {
    return Object.keys(this.getDependencies());
  }

  public setDependencies(dependencies: DependencyMa): Readonly<PackageJSON> {
    return this.setPkg(new PackageJSON({ ...this.getPkg(), dependencies }));
  }

  public getDevDependencies(): Readonly<DependencyMa> {
    return this.getPkg().devDependencies || {};
  }

  public getDevDependencyList(): string[] {
    return Object.keys(this.getDevDependencies());
  }

  public setDevDependencies(devDependencies: DependencyMa): Readonly<PackageJSON> {
    return this.setPkg(new PackageJSON({ ...this.getPkg(), devDependencies }));
  }

  public getScripts(): Readonly<ScriptsMap> {
    return this.getPkg().scripts;
  }

  public setScripts(scripts: ScriptsMap): Readonly<PackageJSON> {
    const origin = this.getPkg();

    return this.setPkg(new PackageJSON({ ...origin, scripts: { ...origin.scripts, ...scripts } }));
  }

  public getRearguard(): Readonly<Rearguard> {
    return this.getPkg().rearguard;
  }

  public setRearguard(rearguard: Rearguard): Readonly<PackageJSON> {
    return this.setPkg(new PackageJSON({ ...this.getPkg(), rearguard }));
  }

  private setPkg(origin: Readonly<PackageJSON>): Readonly<PackageJSON> {
    try {
      if (fs.existsSync(this.file_path)) {
        this.write(origin);
      } else {
        console.error(`File ${this.file_path} not found`);

        process.exit(1);
      }
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return origin;
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

  private write(origin: object): void {
    try {
      fs.writeFileSync(this.file_path, PPJ.format(origin), { encoding: "utf-8" });
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  }
}
