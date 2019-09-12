import { IDependencyMap, IPackageJSON, IScriptsMap } from "./IPackageJSON";
import { IRearguard } from "./IRearguard";

export interface IPackageJSONConfig {
  getPkg(): Readonly<IPackageJSON>;

  getName(): string;
  getVersion(): string;
  getFiles(): string[];

  getDependencies(): Readonly<IDependencyMap>;
  getDependencyList(): string[];
  setDependencies(dependencies: IDependencyMap): Readonly<IPackageJSON>;

  getDevDependencies(): Readonly<IDependencyMap>;
  getDevDependencyList(): string[];
  setDevDependencies(devDependencies: IDependencyMap): Readonly<IPackageJSON>;

  getScripts(): Readonly<IScriptsMap>;
  setScripts(scripts: IScriptsMap): Readonly<IPackageJSON>;

  getRearguard(): Readonly<IRearguard>;
  setRearguard(rearguard: IRearguard): Readonly<IPackageJSON>;
}
