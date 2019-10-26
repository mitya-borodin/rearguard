import { RearguardConfig } from "../../configs/RearguardConfig";
import { StartExecutorOptions } from "../../interfaces/executors/StartExecutorOptions";
import { start_browser_lib } from "./start_browser_lib";
import { start_isomorphic } from "./start_isomorphic";
import { start_browser_app } from "./start_browser_app";
import { start_node_lib } from "./start_node_lib";
import { start_node_app } from "./start_node_app";

const defaultOptions: StartExecutorOptions = {
  release: false,
  debug: false,
  ts_node_dev: false,
};

export async function start_component(
  options: StartExecutorOptions = defaultOptions,
): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare data
  const isIsomorphic = rearguardConfig.isIsomorphic();
  const isBrowser = rearguardConfig.isBrowser();
  const isNode = rearguardConfig.isNode();
  const isApp = rearguardConfig.isApp();
  const isLib = rearguardConfig.isLib();

  if (isIsomorphic) {
    await start_isomorphic(options);
  }

  if (isBrowser && isLib) {
    await start_browser_lib(options);
  }

  if (isBrowser && isApp) {
    await start_browser_app(options);
  }

  if (isNode && isLib) {
    await start_node_lib();
  }

  if (isNode && isApp) {
    await start_node_app();
  }
}
