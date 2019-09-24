import { RearguardConfig } from "../../configs/RearguardConfig";
import { DEFAULT_SCRIPTS } from "../../const";
import { createEntryPoints } from "../actions/createEntryPoints";
import { setConfigs } from "../actions/setConfigs";
import { staticTemplates } from "../actions/staticTemplates";

export async function init_isomorphic(flags: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config;
  const rearguardConfig = new RearguardConfig(CWD);

  // ! Set scripts;
  await rearguardConfig.setScripts({
    start: "rearguard start",
    build: "rearguard build",
    test: "rearguard test",
    sync: "rearguard sync",
    check_deps_on_npm: "rearguard check_deps_on_npm",
    ...DEFAULT_SCRIPTS,
  });

  // ! Set environment in which the code will work;
  await rearguardConfig.setRuntime("isomorphic");

  // ! Set type of project;
  await rearguardConfig.setType("lib");

  // ! Create entry points: index.tsx, export.ts, vendors.ts;
  await createEntryPoints(CWD);

  // ! Set configuration files: tsconfig.json, tests/tsconfig.json, .eslintrc, .gitignore;
  await setConfigs(flags, CWD);

  // ! Apply static templates to project;
  await staticTemplates(flags, CWD);
}
