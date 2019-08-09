import { IDependencyMap, IPackageJSON, IScriptsMap } from "./IPackageJSON";
import { IRearguardConfig } from "./IRearguardConfig";

export interface IPackageJSONConfig {
  getPkg(): Readonly<IPackageJSON>;

  getName(): string;
  getVersion(): string;
  getFiles(): string[];

  getDependencies(): string[];
  setDependencies(dependencies: IDependencyMap): Readonly<IDependencyMap>;

  getDevDependencies(): Readonly<IDependencyMap>;
  setDevDependencies(devDependencies: IDependencyMap): Readonly<IDependencyMap>;

  getScripts(): Readonly<IScriptsMap>;
  setScripts(scripts: IScriptsMap): Readonly<IScriptsMap>;

  getRearguard(): Readonly<IRearguardConfig>;
  setRearguard(rearguard: IRearguardConfig): Readonly<IRearguardConfig>;
}
