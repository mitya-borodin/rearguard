import { defaultsDeep } from "lodash";
import { IRearguard } from "../interfaces/configs/IRearguard";
import { IRearguardConfig } from "../interfaces/configs/IRearguardConfig";
import { PackageJSONConfig } from "./PackageJSONConfig";
import { Rearguard } from "./Rearguard";

export class RearguardConfig extends PackageJSONConfig implements IRearguardConfig {
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

  public setRuntime(runtime: "browser" | "node" | "isomorphic"): IRearguardConfig {
    const update: object = defaultsDeep(this.getRearguard(), { project: { runtime } });
    const rearguard: Readonly<IRearguard> = new Rearguard(update);

    this.setRearguard(rearguard);

    return this;
  }

  public setType(type: "app" | "lib"): IRearguardConfig {
    const update: object = defaultsDeep(this.getRearguard(), { project: { type } });
    const rearguard: Readonly<IRearguard> = new Rearguard(update);

    this.setRearguard(rearguard);

    return this;
  }
}
