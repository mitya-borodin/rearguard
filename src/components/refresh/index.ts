import { RearguardConfig } from "../../configs/RearguardConfig";
import { init_browser_app } from "../init/init_browser_app";
import { init_browser_dll } from "../init/init_browser_dll";
import { init_browser_lib } from "../init/init_browser_lib";
import { init_isomorphic } from "../init/init_isomorphic";
import { init_mono } from "../init/init_mono";
import { init_node_app } from "../init/init_node_app";
import { init_node_lib } from "../init/init_node_lib";
import { updateVSCodeSettingsForMonoRepo } from "../procedures/updateVSCodeSettingsForMonoRepo";

export async function refresh_executor(options: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const isBrowser = rearguardConfig.isBrowser();
  const isIsomorphic = rearguardConfig.isIsomorphic();
  const isNode = rearguardConfig.isNode();
  const isApp = rearguardConfig.isApp();
  const isDll = rearguardConfig.isDll();
  const isLib = rearguardConfig.isLib();
  const isMono = rearguardConfig.isMono();

  await updateVSCodeSettingsForMonoRepo(CWD);

  if (isDll) {
    await init_browser_dll(options);
  }

  if (isBrowser) {
    if (isApp) {
      await init_browser_app(options);
    }
    if (isLib) {
      await init_browser_lib(options);
    }
  }

  if (isNode) {
    if (isApp) {
      await init_node_app(options);
    }
    if (isLib) {
      await init_node_lib(options);
    }
  }

  if (isIsomorphic) {
    await init_isomorphic(options);
  }

  if (isMono) {
    await init_mono(options);
  }
}
