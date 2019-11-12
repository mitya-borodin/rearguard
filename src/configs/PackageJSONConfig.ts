import fs from "fs";
import path from "path";
import prettier from "prettier";
import PPJ from "prettier-package-json";
import semver from "semver";
import { snakeCase } from "lodash";
import { PRETTIER_JSON_STRINGIFY } from "../const";
import { DependencyMap, ScriptsMap } from "../interfaces/configs/PackageJSON";
import { PackageJSON } from "./PackageJSON";
import { Rearguard } from "./Rearguard";

export class PackageJSONConfig {
  protected CWD: string;
  protected packageJsonFileName: string;
  public readonly pathToPackageJsonFile: string;

  constructor(CWD: string = process.cwd()) {
    this.CWD = CWD;
    this.packageJsonFileName = "package.json";
    this.pathToPackageJsonFile = path.resolve(this.CWD, this.packageJsonFileName);
  }

  public getPkg(): Readonly<PackageJSON> {
    try {
      if (fs.existsSync(this.pathToPackageJsonFile)) {
        const origin = JSON.parse(
          fs.readFileSync(this.pathToPackageJsonFile, { encoding: "utf-8" }),
        );

        return new PackageJSON(origin);
      } else {
        console.error(`File ${this.pathToPackageJsonFile} not found`);

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

  public getSnakeName(): string {
    return snakeCase(this.getName());
  }

  public getVersion(): string {
    return this.getPkg().version;
  }

  public getFiles(): string[] {
    return this.getPkg().files;
  }

  public getBrowserslist(): string[] {
    return this.getPkg().browserslist;
  }

  public async setFiles(files: string[]): Promise<Readonly<PackageJSON>> {
    const origin = this.getPkg();
    const pkg = new PackageJSON({ ...origin, files });

    return await this.setPkg(pkg);
  }

  public async setTypes(types: string): Promise<Readonly<PackageJSON>> {
    const origin = this.getPkg();
    const pkg = new PackageJSON({ ...origin, types });

    return await this.setPkg(pkg);
  }

  public async setMain(main: string): Promise<Readonly<PackageJSON>> {
    const origin = this.getPkg();
    const pkg = new PackageJSON({ ...origin, main });

    return await this.setPkg(pkg);
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

  public async setDependencyVersion(
    dependencyName: string,
    version: string,
  ): Promise<Readonly<PackageJSON>> {
    const pkg = this.getPkg();
    const dependencies = { ...pkg.dependencies };
    const devDependencies = { ...pkg.devDependencies };
    const peerDependencies = { ...pkg.peerDependencies };

    if (semver.valid(dependencies[dependencyName]) && semver.valid(version)) {
      dependencies[dependencyName] = version;
    }

    if (semver.valid(devDependencies[dependencyName]) && semver.valid(version)) {
      devDependencies[dependencyName] = version;
    }

    if (semver.valid(peerDependencies[dependencyName]) && semver.valid(version)) {
      peerDependencies[dependencyName] = version;
    }

    return await this.setPkg(
      new PackageJSON({ ...this.getPkg(), dependencies, devDependencies, peerDependencies }),
    );
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

  public getPeerDependencies(): Readonly<DependencyMap> {
    return this.getPkg().peerDependencies || {};
  }

  public getPeerDependencyList(): string[] {
    return Object.keys(this.getPeerDependencies());
  }

  public async setPeerDependencies(
    peerDependencies: Readonly<DependencyMap>,
  ): Promise<Readonly<PackageJSON>> {
    return await this.setPkg(new PackageJSON({ ...this.getPkg(), peerDependencies }));
  }

  public getScripts(): Readonly<ScriptsMap> {
    return this.getPkg().scripts;
  }

  public async setScripts(
    scripts: Readonly<ScriptsMap>,
    force = false,
  ): Promise<Readonly<PackageJSON>> {
    const origin = this.getPkg();

    const pkg = new PackageJSON({
      ...origin,
      scripts: force ? scripts : { ...origin.scripts, ...scripts },
    });

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
      if (fs.existsSync(this.pathToPackageJsonFile)) {
        const formatedJSON = JSON.parse(PPJ.format(origin.toJSON()));

        // ! ==========================================
        // !
        // ! Manky patching for cancel script sorting;
        // !
        // ! ==========================================

        formatedJSON.scripts = origin.scripts;

        const content = prettier.format(JSON.stringify(formatedJSON), PRETTIER_JSON_STRINGIFY);

        fs.writeFileSync(this.pathToPackageJsonFile, content, { encoding: "utf-8" });
      } else {
        console.error(`File ${this.pathToPackageJsonFile} not found`);

        process.exit(1);
      }
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return origin;
  }
}
