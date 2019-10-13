import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { build_isomorphic } from "./build_isomorphic";
import { build_browser_lib } from "./build_browser_lib";
import { build_browser_app } from "./build_browser_app";
import { build_node_lib } from "./build_node_lib";
import { build_node_app } from "./build_node_app";
import { build_browser_dll } from "./build_browser_dll";

const defaultOptions: BuildExecutorOptions = {
  only_dev: false,
  debug: false,
  need_update_build_time: false,
};

export async function build_component(
  options: BuildExecutorOptions = defaultOptions,
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
    await build_isomorphic(options);
  }

  if (isBrowser && isDll) {
    await build_browser_dll(options);
  }

  if (isBrowser && isLib) {
    await build_browser_lib(options);
  }

  if (isBrowser && isApp) {
    await build_browser_app(options);
  }

  if (isNode && isLib) {
    await build_node_lib();
  }

  if (isNode && isApp) {
    await build_node_app(options);
  }
}
