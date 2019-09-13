import { IRearguardLocal } from "./IRearguardLocal";

export interface IRearguardLocalConfig {
  getConfig(): Readonly<IRearguardLocal>;
  setConfig(config: IRearguardLocal): Readonly<IRearguardLocal>;
}
