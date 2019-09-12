import { IPackageJSONConfig } from "./IPackageJSONConfig";

export interface IRearguardConfig extends IPackageJSONConfig {
  getContext(): string;
  getEntry(): string;
  getDllEntry(): string;
  getLibEntry(): string;
  getOutput(): {
    path: string;
    publicPath: string;
  };
  getProjectDeps(): string[];

  setRuntime(runtime: "browser" | "node" | "isomorphic"): IRearguardConfig;
  setType(type: "app" | "lib"): IRearguardConfig;
}
