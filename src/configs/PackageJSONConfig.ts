import * as fs from "fs";
import * as path from "path";
import * as PPJ from "prettier-package-json";
import { DependencyMap, ScriptsMap } from "../interfaces/configs/PackageJSON";
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
    try {
      if (fs.existsSync(this.file_path)) {
        const origin = JSON.parse(fs.readFileSync(this.file_path, { encoding: "utf-8" }));

        return new PackageJSON(origin);
      } else {
        console.error(`File ${this.file_path} not found`);

        process.exit(1);
      }
    } catch (error) {
      console.error(error);

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

  public getDependencies(): Readonly<DependencyMap> {
    return this.getPkg().dependencies || {};
  }

  public getDependencyList(): string[] {
    return Object.keys(this.getDependencies());
  }

  public async setDependencies(
    dependencies: Readonly<DependencyMap>,
  ): Promise<Readonly<PackageJSON>> {
    return await this.setPkg(new PackageJSON({ ...this.getPkg(), dependencies }));
  }

  public getDevDependencies(): Readonly<DependencyMap> {
    return this.getPkg().devDependencies || {};
  }

  public getDevDependencyList(): string[] {
    return Object.keys(this.getDevDependencies());
  }

  public async setDevDependencies(
    devDependencies: Readonly<DependencyMap>,
  ): Promise<Readonly<PackageJSON>> {
    return await this.setPkg(new PackageJSON({ ...this.getPkg(), devDependencies }));
  }

  public getScripts(): Readonly<ScriptsMap> {
    return this.getPkg().scripts;
  }

  public async setScripts(scripts: Readonly<ScriptsMap>): Promise<Readonly<PackageJSON>> {
    const origin = this.getPkg();
    const pkg = new PackageJSON({ ...origin, scripts: { ...origin.scripts, ...scripts } });

    return await this.setPkg(pkg);
  }

  public getRearguard(): Readonly<Rearguard> {
    return this.getPkg().rearguard;
  }

  public async setRearguard(rearguard: Readonly<Rearguard>): Promise<Readonly<PackageJSON>> {
    return await this.setPkg(new PackageJSON({ ...this.getPkg(), rearguard }));
  }

  private async setPkg(origin: Readonly<PackageJSON>): Promise<Readonly<PackageJSON>> {
    try {
      if (fs.existsSync(this.file_path)) {
        fs.writeFileSync(this.file_path, PPJ.format(origin), { encoding: "utf-8" });
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
}
