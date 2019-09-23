import { RearguardConfig } from "../../configs/RearguardConfig";
import { staticTemplates } from "./helpers/staticTemplates";
import { dynamicTemplates } from "../helpers/dynamicTemplates";

export async function init_isomorphic(flags: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);

  await rearguardConfig.setScripts({
    start: "rearguard start",
    build: "rearguard build",
    test: "rearguard test",
    sync: "rearguard sync",
    check_deps_on_npm: "rearguard check_deps_on_npm",
  });
  await rearguardConfig.setRuntime("isomorphic");
  await rearguardConfig.setType("lib");

  await dynamicTemplates(CWD, flags);
  await staticTemplates(flags);
}
