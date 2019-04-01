import { IEnvConfig } from "../interfaces/config/IEnvConfig";
import { IRearguardConfig } from "../interfaces/config/IRearguardConfig";

export async function copy_back_end_deps(envConfig: IEnvConfig, rearguardConfig: IRearguardConfig): Promise<void> {
  const { back_end_deps } = rearguardConfig;

  console.log(back_end_deps);
}
