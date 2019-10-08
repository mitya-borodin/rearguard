import { RearguardConfig } from "../../configs/RearguardConfig";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { getModuleSetForReBuild } from "../procedures/getModuleSetForReBuild";

export async function build_browser_app(options: BuildExecutorOptions): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);

  console.log("----" || rearguardConfig || options);

  console.log(await getModuleSetForReBuild(process.cwd()));
}
