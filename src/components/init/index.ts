import { InitExecutorOptions } from "../../interfaces/executors/InitExecutorOptions";
import { init_browser_app } from "./init_browser_app";
import { init_browser_lib } from "./init_browser_lib";
import { init_isomorphic } from "./init_isomorphic";
import { init_node_app } from "./init_node_app";
import { init_node_lib } from "./init_node_lib";
import { init_browser_dll } from "./init_browser_dll";

const defaultOptions: InitExecutorOptions = {
  dll: false,
  browser: false,
  node: false,
  app: false,
  lib: false,
  force: false,
};

export async function init_component(options: InitExecutorOptions = defaultOptions): Promise<void> {
  if (options.dll) {
    await init_browser_dll();
  }

  if (options.browser && !options.node) {
    if (options.app) {
      await init_browser_app({ force: options.force });
    }
    if (options.lib) {
      await init_browser_lib({ force: options.force });
    }
  }

  if (!options.browser && options.node) {
    if (options.app) {
      await init_node_app({ force: options.force });
    }
    if (options.lib) {
      await init_node_lib({ force: options.force });
    }
  }

  if (options.browser && options.node) {
    await init_isomorphic({ force: options.force });
  }
}
