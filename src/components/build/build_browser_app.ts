import { RearguardConfig } from "../../configs/RearguardConfig";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";

export async function build_browser_app(options: BuildExecutorOptions): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);

  console.log(CWD || rearguardConfig || options);

  await copyGlobalLinkedModules(CWD);
}
