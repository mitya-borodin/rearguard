import fs from "fs";
import { merge } from "lodash";
import path from "path";
import { promisify } from "util";
import { getLocalNodeModulePath } from "../helpers/dependencyPaths";
import { PackageJSONConfig } from "./PackageJSONConfig";
import { Rearguard } from "./Rearguard";

const dependenciesNotCreatedWithRearguard: Set<string> = new Set();
const dependenciesCreatedWithRearguard: Set<string> = new Set();

const exists = promisify(fs.exists);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

export class RearguardConfig extends PackageJSONConfig {
  static isRearguard = async (pkgPath: string): Promise<boolean> => {
    if (await exists(pkgPath)) {
      const pkgContent = await readFile(pkgPath, { encoding: "utf-8" });
      const pkg = JSON.parse(pkgContent);

      return pkg.hasOwnProperty("rearguard");
    }

    return false;
  };

  static findNodeModulesInParentDirectory = (CWD: string, depth = 0): string => {
    const nodeModules = getLocalNodeModulePath(CWD);

    if (fs.existsSync(nodeModules)) {
      return nodeModules;
    } else if (depth <= 3) {
      // ! Looking for above to 3 level, because npm package may have namespace
      return RearguardConfig.findNodeModulesInParentDirectory(path.resolve(CWD, ".."), depth + 1);
    } else {
      throw new Error(
        `[ FIND_NODE_MODULES_IN_PARENT ][ node_modules not found here: ${nodeModules} ]`,
      );
    }
  };

  static findDependencyInParentNodeModules = (
    CWD: string,
    dependencyName: string,
    depth = 0,
  ): string => {
    const nodeModules = getLocalNodeModulePath(CWD);
    const dependencyPath = path.resolve(nodeModules, dependencyName);

    if (fs.existsSync(dependencyPath)) {
      return dependencyPath;
    } else if (depth <= 6) {
      // ! Looking for above to 6 level, because npm package may have namespace
      return RearguardConfig.findDependencyInParentNodeModules(
        path.resolve(CWD, ".."),
        dependencyName,
        depth + 1,
      );
    } else {
      throw new Error(
        `[ FIND_DEPENDENCY_IN_PARENT_NODE_MODULES ][ dependency not found here: ${dependencyPath} ]`,
      );
    }
  };

  public getBin(): string {
    return this.getRearguard().bin;
  }
  public getContext(): string {
    return this.getRearguard().webpack.context;
  }

  public getModules(): string[] {
    return this.getRearguard().webpack.modules;
  }

  public getEntry(): string {
    return this.getRearguard().webpack.entry;
  }

  public getDllEntry(): string {
    return this.getRearguard().webpack.dll_entry;
  }

  public getLibEntry(): string {
    return this.getRearguard().webpack.lib_entry;
  }

  public getOutput(): {
    path: string;
    publicPath: string;
    library?: string;
    libraryTarget:
      | "var"
      | "assign"
      | "this"
      | "window"
      | "global"
      | "commonjs"
      | "commonjs2"
      | "amd"
      | "umd"
      | "jsonp";
  } {
    return this.getRearguard().webpack.output;
  }

  public getUnPublishedDependency(): string[] {
    return this.getRearguard().project.unPublishedDependency;
  }

  public getComponents(): string[] {
    return this.getRearguard().project.components;
  }

  public isPublishToGit(): boolean {
    return this.getRearguard().distribution.publish_to_git;
  }

  public isOverwriteTSConfig(): boolean {
    return !this.getRearguard().configs.noOverwriteTSConfig;
  }

  public isOverwriteTSTestConfig(): boolean {
    return !this.getRearguard().configs.noOverwriteTSTestConfig;
  }

  public isOverwriteLintConfig(): boolean {
    return !this.getRearguard().configs.noOverwriteLintConfig;
  }

  public isOverwriteGitIgnore(): boolean {
    return !this.getRearguard().configs.noOverwriteGitIgnore;
  }

  public isLib(): boolean {
    const { type } = this.getRearguard().project;

    return type === "lib";
  }

  public isApp(): boolean {
    const { type } = this.getRearguard().project;

    return type === "app";
  }

  public isDll(): boolean {
    const { type } = this.getRearguard().project;

    return type === "dll";
  }

  public isMono(): boolean {
    const { type } = this.getRearguard().project;

    return type === "mono";
  }

  public isIsomorphic(): boolean {
    const { runtime } = this.getRearguard().project;

    return runtime === "isomorphic";
  }

  public isBrowser(): boolean {
    const { runtime } = this.getRearguard().project;

    return runtime === "browser";
  }

  public isNode(): boolean {
    const { runtime } = this.getRearguard().project;

    return runtime === "node";
  }

  public isNodeLib(): boolean {
    return this.isNode() && this.isLib();
  }

  public isNodeApp(): boolean {
    const { type } = this.getRearguard().project;

    return this.isNode() && type === "app";
  }

  public willLoadOnDemand(): boolean {
    const { thisModuleWillLoadOnDemand } = this.getRearguard().project;

    return thisModuleWillLoadOnDemand;
  }

  public buildListOfLoadOnDemandModulesForAll(): boolean {
    const { buildListOfLoadOnDemandModulesForAll } = this.getRearguard().project;

    return buildListOfLoadOnDemandModulesForAll;
  }

  public getCSS(): [string, boolean] {
    const { postcssPlugins, useOnlyIsomorphicStyleLoader } = this.getRearguard().css;

    return [postcssPlugins, useOnlyIsomorphicStyleLoader];
  }

  public getHTML(): {
    noInjectAssets: boolean;
  } {
    return this.getRearguard().html;
  }

  public async setRuntime(runtime: "browser" | "node" | "isomorphic"): Promise<void> {
    await this.setRearguard(new Rearguard(merge(this.getRearguard(), { project: { runtime } })));
  }

  public async setType(type: "dll" | "app" | "lib" | "mono"): Promise<void> {
    await this.setRearguard(new Rearguard(merge(this.getRearguard(), { project: { type } })));
  }

  public async setBin(bin: string): Promise<void> {
    await this.setRearguard(new Rearguard(merge(this.getRearguard(), { bin })));
  }

  public async setComponents(components: string[]): Promise<void> {
    await this.setRearguard(new Rearguard(merge(this.getRearguard(), { project: { components } })));
  }

  public async getDependenciesCreatedWithRearguard(
    monoDependencyDirs: string[] = [],
    searchInMonoDirectory = false,
  ): Promise<Set<string>> {
    // ! У проекта могут быть два типа зависимостей
    // ! 1) Те которые опубликованы в каком либо npm registry
    // ! 2) Те которые доступны в глобальном node_modules и в моно репозитории рядом с проектом

    // ? Основная причина почему существует список не опубликованных зависимостей в том, что
    // ? Rearguard определяет зависимости исходя из ключей (package.json).dependencies.
    // ? Так как зависимости не опубликованы то их нельзя указать в package.json).dependencies,
    // ? Но подключить их в сборку необходимо, и по этому существует список неопубликованных зависимостей,
    // ? которые находятся радом в моно репозитории. Так же они могут быть и не в моно репозитории, но
    // ? они должны быть слинкованны перед запуском сборки, иначе система их не найдет.

    // * При работе с моно репозиторием никаких проблем быть не должно, так как в момент npm run bootstrap
    // * все необходимые линки будут установлены.

    const projectDeps: Set<string> = new Set(this.getUnPublishedDependency());

    if (searchInMonoDirectory) {
      for (const monoDependencyDir of monoDependencyDirs) {
        const pathToMonoDependency = path.resolve(this.CWD, monoDependencyDir);
        const dependencyDirs = (await readdir(pathToMonoDependency)).map((dirName) =>
          path.resolve(pathToMonoDependency, dirName),
        );

        for (const dependencyDir of dependencyDirs) {
          const rearguardConfig = new RearguardConfig(dependencyDir);
          const dependencyName = rearguardConfig.getName();

          if (dependenciesCreatedWithRearguard.has(dependencyName)) {
            projectDeps.add(dependencyName);
            continue;
          }

          if (!dependenciesNotCreatedWithRearguard.has(dependencyName)) {
            const pkgPath = path.resolve(dependencyDir, this.packageJsonFileName);

            if (await RearguardConfig.isRearguard(pkgPath)) {
              projectDeps.add(dependencyName);
              dependenciesCreatedWithRearguard.add(dependencyName);
            } else {
              dependenciesNotCreatedWithRearguard.add(dependencyName);
            }
          }
        }
      }
    } else {
      const nodeModulePath = RearguardConfig.findNodeModulesInParentDirectory(this.CWD);
      const dependencyList = this.getDependencyList();

      for (const dependencyName of dependencyList) {
        if (dependenciesCreatedWithRearguard.has(dependencyName)) {
          projectDeps.add(dependencyName);
          continue;
        }

        if (dependenciesNotCreatedWithRearguard.has(dependencyName)) {
          continue;
        }

        const pkgPath = path.resolve(nodeModulePath, dependencyName, this.packageJsonFileName);

        if (await RearguardConfig.isRearguard(pkgPath)) {
          projectDeps.add(dependencyName);
          dependenciesCreatedWithRearguard.add(dependencyName);
        } else {
          dependenciesNotCreatedWithRearguard.add(dependencyName);
        }
      }
    }

    return projectDeps;
  }
}
