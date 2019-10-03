import { RearguardConfig } from "../../configs/RearguardConfig";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";

export async function build_node_app(options: BuildExecutorOptions): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);
}
