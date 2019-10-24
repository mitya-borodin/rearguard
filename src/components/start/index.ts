import { RearguardConfig } from "../../configs/RearguardConfig";
import { StartExecutorOptions } from "../../interfaces/executors/StartExecutorOptions";
import { start_isomorphic } from "./start_isomorphic";

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
  const isDll = rearguardConfig.isDll();

  if (isIsomorphic) {
    await start_isomorphic(options);
  }

  if (isBrowser && isDll) {
    console.log("START_BROWSER_DLL", options);
  }

  if (isBrowser && isLib) {
    console.log("START_BROWSER_LIB", options);
  }

  if (isBrowser && isApp) {
    console.log("START_BROWSER_APP", options);
  }

  if (isNode && isLib) {
    console.log("START_NODE_LIB", options);
  }

  if (isNode && isApp) {
    console.log("START_NODE_APP", options);
  }
}
