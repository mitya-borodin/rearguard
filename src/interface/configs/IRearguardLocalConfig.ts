import { IRearguardLocal } from "./IRearguardLocal";

export interface IRearguardLocalConfig extends IRearguardLocal {
  getConfig(): Readonly<IRearguardLocal>;
  setConfig(config: IRearguardLocal): Readonly<IRearguardLocal>;
}
