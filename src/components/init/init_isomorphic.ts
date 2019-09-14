import { RearguardConfig } from "../../configs/RearguardConfig";
import { IScriptsMap } from "../../interfaces/configs/IPackageJSON";
import { IRearguardConfig } from "../../interfaces/configs/IRearguardConfig";
import { createEntries } from "./createEntries";
import { renderTemplates } from "./renderTemplates";

export async function init_isomorphic(options: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();
  const rearguardConfig: IRearguardConfig = new RearguardConfig(CWD);
  const scripts: Readonly<IScriptsMap> = rearguardConfig.getScripts();

  rearguardConfig.setRuntime("isomorphic");
  rearguardConfig.setType("lib");
  rearguardConfig.setScripts({
    ...scripts,
    start: "rearguard start",
    build: "rearguard build",
    test: "rearguard test",
    sync: "rearguard sync",
    check_deps_on_npm: "rearguard check_deps_on_npm",
  });

  await createEntries(CWD);
  await renderTemplates(CWD, options);
}
