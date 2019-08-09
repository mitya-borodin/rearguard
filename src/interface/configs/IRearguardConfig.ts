import { IPackageJSONConfig } from "./IPackageJSONConfig";
import { IRearguard } from "./IRearguard";

export interface IRearguardConfig extends IPackageJSONConfig {
  getContext(): string;
  getEntry(): string;
  getDllEntry(): string;
  getLibEntry(): string;
  getOutput(): {
    path: string;
    publicPath: string;
  };
  getDeps(): string[];

  setRuntime(runtime: "browser" | "node"): IRearguardConfig;
  setType(type: "app" | "lib"): IRearguardConfig;
}
