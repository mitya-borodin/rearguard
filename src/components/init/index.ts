import { IInitExecutorOptions } from "../../interfaces/executors/IInitExecutorOptions";
import { init_browser_app } from "./init_browser_app";
import { init_browser_lib } from "./init_browser_lib";
import { init_isomorphic } from "./init_isomorphic";
import { init_node_app } from "./init_node_app";
import { init_node_lib } from "./init_node_lib";

const defaultOptions: IInitExecutorOptions = {
  browser: false,
  node: false,
  app: false,
  lib: false,
  force: false,
};

export async function init_component(
  options: IInitExecutorOptions = defaultOptions,
): Promise<void> {
  if (options.browser && !options.node) {
    if (options.app) {
      init_browser_app({ force: options.force });
    }
    if (options.lib) {
      init_browser_lib({ force: options.force });
    }
  }

  if (!options.browser && options.node) {
    if (options.app) {
      init_node_app({ force: options.force });
    }
    if (options.lib) {
      init_node_lib({ force: options.force });
    }
  }

  if (options.browser && options.node) {
    init_isomorphic({ force: options.force });
  }
}
