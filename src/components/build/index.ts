import { RearguardConfig } from "../../configs/RearguardConfig";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";
import { updateVSCodeSettingsForMonoRepo } from "../procedures/updateVSCodeSettingsForMonoRepo";
import { build_browser_app } from "./build_browser_app";
import { build_browser_dll } from "./build_browser_dll";
import { build_browser_lib } from "./build_browser_lib";
import { build_isomorphic } from "./build_isomorphic";
import { build_node_app } from "./build_node_app";
import { build_node_lib } from "./build_node_lib";

const defaultOptions: BuildExecutorOptions = {
  only_dev: false,
  debug: false,
  need_update_build_time: false,
  bypass_the_queue: false,
};

export async function build_component(
  options: BuildExecutorOptions = defaultOptions,
): Promise<void> {
  try {
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

    await updateVSCodeSettingsForMonoRepo(CWD);

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
      await build_node_lib(options);
    }

    if (isNode && isApp) {
      await build_node_app(options);
    }
  } catch (error) {
    console.error(error);
  }
}
