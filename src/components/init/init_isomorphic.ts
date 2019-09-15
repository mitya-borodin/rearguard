import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { TypescriptConfig } from "../../configs/TypescriptConfig";
import { TESTS_DIR_NAME } from "../../const";
import { createEntries } from "./createEntries";
import { renderTemplates } from "./renderTemplates";

export async function init_isomorphic(options: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();
  const CWDForTests: string = path.resolve(CWD, TESTS_DIR_NAME);

  const rearguardConfig = new RearguardConfig(CWD);
  const typescriptConfig = new TypescriptConfig(CWD);
  const typescriptForTestsConfig = new TypescriptConfig(CWDForTests);

  const scripts = rearguardConfig.getScripts();

  rearguardConfig.setScripts({
    ...scripts,
    start: "rearguard start",
    build: "rearguard build",
    test: "rearguard test",
    sync: "rearguard sync",
    check_deps_on_npm: "rearguard check_deps_on_npm",
  });
  rearguardConfig.setRuntime("isomorphic");
  rearguardConfig.setType("lib");

  await createEntries(CWD);
  await typescriptConfig.init();
  await typescriptForTestsConfig.init();
  await renderTemplates(CWD, options);
}
