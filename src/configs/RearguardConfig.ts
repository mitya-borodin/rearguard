import * as fs from "fs";
import * as path from "path";
import { merge } from "lodash";
import { PackageJSONConfig } from "./PackageJSONConfig";
import { Rearguard } from "./Rearguard";
import { getLocalNodeModulePath } from "../helpers/dependencyPaths";

const dependenciesNotCreatedWithRearguard: Set<string> = new Set();
const dependenciesCreatedWithRearguard: Set<string> = new Set();

export class RearguardConfig extends PackageJSONConfig {
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
  } {
    return this.getRearguard().webpack.output;
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
    const { will_load_on_demand } = this.getRearguard().project;

    return will_load_on_demand;
  }

  public getCSS(): [string, boolean] {
    const { postcssPlugins, useOnlyIsomorphicStyleLoader } = this.getRearguard().css;

    return [postcssPlugins, useOnlyIsomorphicStyleLoader];
  }

  public async setRuntime(runtime: "browser" | "node" | "isomorphic"): Promise<void> {
    await this.setRearguard(new Rearguard(merge(this.getRearguard(), { project: { runtime } })));
  }

  public async setType(type: "dll" | "app" | "lib"): Promise<void> {
    await this.setRearguard(new Rearguard(merge(this.getRearguard(), { project: { type } })));
  }

  public async getDependenciesCreatedWithRearguard(): Promise<Set<string>> {
    const nodeModulePath = this.findNodeModulesInParentDirectory(this.CWD);
    const dependencyList = this.getDependencyList();
    const projectDeps: Set<string> = new Set();

    for (const dependencyName of dependencyList) {
      if (dependenciesCreatedWithRearguard.has(dependencyName)) {
        projectDeps.add(dependencyName);
        continue;
      }

      if (!dependenciesNotCreatedWithRearguard.has(dependencyName)) {
        const pkgPath = path.resolve(nodeModulePath, dependencyName, this.packageJsonFileName);

        if (fs.existsSync(pkgPath)) {
          const pkgContent = fs.readFileSync(pkgPath, { encoding: "utf-8" });
          const pkg = JSON.parse(pkgContent);

          if (pkg.hasOwnProperty("rearguard")) {
            projectDeps.add(dependencyName);
            dependenciesCreatedWithRearguard.add(dependencyName);
          } else {
            dependenciesNotCreatedWithRearguard.add(dependencyName);
          }
        }
      }
    }

    return projectDeps;
  }

  public findNodeModulesInParentDirectory(CWD: string, count = 0): string {
    const nodeModules = getLocalNodeModulePath(CWD);

    if (fs.existsSync(nodeModules)) {
      return nodeModules;
      // ! Looking for above to 3 level, because npm package may have namespace
    } else if (count <= 3) {
      return this.findNodeModulesInParentDirectory(path.resolve(CWD, ".."), count + 1);
    } else {
      throw new Error(
        `[ FIND_NODE_MODULES_IN_PARENT ][ node_modules not found here: ${nodeModules} ]`,
      );
    }
  }
}
