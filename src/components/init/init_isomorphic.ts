import { RearguardConfig } from "../../configs/RearguardConfig";
import { DEFAULT_SCRIPTS } from "../../const";
import { dynamicTemplates } from "../helpers/dynamicTemplates";
import { staticTemplates } from "../helpers/staticTemplates";

export async function init_isomorphic(flags: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);

  await rearguardConfig.setScripts({
    start: "rearguard start",
    build: "rearguard build",
    test: "rearguard test",
    sync: "rearguard sync",
    check_deps_on_npm: "rearguard check_deps_on_npm",
    ...DEFAULT_SCRIPTS,
  });
  await rearguardConfig.setRuntime("isomorphic");
  await rearguardConfig.setType("lib");

  await dynamicTemplates(CWD, flags);
  await staticTemplates(flags);
}
