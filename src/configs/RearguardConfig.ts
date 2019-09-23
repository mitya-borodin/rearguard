import { merge } from "lodash";
import { PackageJSONConfig } from "./PackageJSONConfig";
import { Rearguard } from "./Rearguard";

export class RearguardConfig extends PackageJSONConfig {
  public getContext(): string {
    return this.getRearguard().webpack.context;
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

  public getProjectDeps(): string[] {
    return this.getRearguard().project.deps;
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

  public isOverwriteTSLintConfig(): boolean {
    return !this.getRearguard().configs.noOverwriteLintConfig;
  }

  public isOverwriteGitIgnore(): boolean {
    return !this.getRearguard().configs.noOverwriteGitIgnore;
  }

  public async setRuntime(runtime: "browser" | "node" | "isomorphic"): Promise<void> {
    await this.setRearguard(new Rearguard(merge(this.getRearguard(), { project: { runtime } })));
  }

  public async setType(type: "app" | "lib"): Promise<void> {
    await this.setRearguard(new Rearguard(merge(this.getRearguard(), { project: { type } })));
  }
}
