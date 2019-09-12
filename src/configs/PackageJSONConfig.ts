import * as fs from "fs";
import * as path from "path";
import * as PPJ from "prettier-package-json";
import { IDependencyMap, IPackageJSON, IScriptsMap } from "../interface/configs/IPackageJSON";
import { IPackageJSONConfig } from "../interface/configs/IPackageJSONConfig";
import { IRearguard } from "../interface/configs/IRearguard";
import { PackageJSON } from "./PackageJSON";
import { Rearguard } from "./Rearguard";

export class PackageJSONConfig implements IPackageJSONConfig {
  private CWD: string;
  private file_name: string;
  private file: string;

  constructor(CWD: string = process.cwd()) {
    this.CWD = CWD;
    this.file_name = "package.json";
    this.file = path.resolve(this.CWD, this.file_name);
  }

  public getPkg(): Readonly<IPackageJSON> {
    if (fs.existsSync(this.file)) {
      const content_of_pkg_file = fs.readFileSync(this.file, { encoding: "utf-8" });

      try {
        return new PackageJSON(JSON.parse(content_of_pkg_file));
      } catch (error) {
        console.error(error);

        process.exit(1);
      }
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

  public getDependencies(): Readonly<IDependencyMap> {
    return this.getPkg().dependencies || {};
  }

  public getDependencyList(): string[] {
    return Object.keys(this.getDependencies());
  }

  public setDependencies(dependencies: IDependencyMap): Readonly<IPackageJSON> {
    const newPkg: Readonly<IPackageJSON> = new PackageJSON({ ...this.getPkg(), dependencies });

    return this.setPkg(newPkg);
  }

  public getDevDependencies(): Readonly<IDependencyMap> {
    return this.getPkg().devDependencies || {};
  }

  public getDevDependencyList(): string[] {
    return Object.keys(this.getDevDependencies());
  }

  public setDevDependencies(devDependencies: IDependencyMap): Readonly<IPackageJSON> {
    const newPkg: Readonly<IPackageJSON> = new PackageJSON({ ...this.getPkg(), devDependencies });

    return this.setPkg(newPkg);
  }

  public getScripts(): Readonly<IScriptsMap> {
    return this.getPkg().scripts || {};
  }

  public setScripts(scripts: IScriptsMap): Readonly<IPackageJSON> {
    const newPkg: Readonly<IPackageJSON> = new PackageJSON({ ...this.getPkg(), scripts });

    return this.setPkg(newPkg);
  }

  public getRearguard(): Readonly<IRearguard> {
    return new Rearguard(this.getPkg().rearguard);
  }

  public setRearguard(rearguard: IRearguard): Readonly<IPackageJSON> {
    const newPkg: Readonly<IPackageJSON> = new PackageJSON({ ...this.getPkg(), rearguard: new Rearguard(rearguard) });

    return this.setPkg(newPkg);
  }

  private setPkg(pkg: Partial<IPackageJSON>): Readonly<IPackageJSON> {
    const newPkg: Readonly<IPackageJSON> = new PackageJSON(pkg);

    try {
      if (fs.existsSync(this.file)) {
        fs.writeFileSync(this.file, PPJ.format(newPkg), { encoding: "utf-8" });
      } else {
        process.exit(1);
      }
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return newPkg;
  }
}
