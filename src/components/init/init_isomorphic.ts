import { RearguardConfig } from "../../configs/RearguardConfig";
import { commonPreset } from "../procedures/commonPreset";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";

export async function init_isomorphic(flags: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  // ! Set status.
  await rearguardLocalConfig.setBuildStatus("init");

  // ! Set environment in which the code will work
  await rearguardConfig.setRuntime("isomorphic");

  // ! Set type of project
  await rearguardConfig.setType("lib");

  // ! Set scripts
  // ! Create entry points: index.tsx, export.ts, vendors.ts
  // ! Set configuration files: tsconfig.json, tests/tsconfig.json, .eslintrc, .gitignore
  // ! Apply static templates to project
  // ! Check/Install dependencies
  await commonPreset(flags, CWD);
}
