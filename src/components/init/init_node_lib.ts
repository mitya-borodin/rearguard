import { RearguardConfig } from "../../configs/RearguardConfig";
import { RearguardDevConfig } from "../../configs/RearguardDevConfig";
import { commonPreset } from "../procedures/commonPreset";
import { initPackage } from "../procedures/initPackage";
import { updatePkgFiles } from "../procedures/updatePkgFiles";

export async function init_node_lib(flags: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();

  await initPackage(CWD);

  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardDevConfig(CWD);

  // ! Set status.
  await rearguardLocalConfig.setBuildStatus("init");

  // ! Set environment in which the code will work
  await rearguardConfig.setRuntime("node");

  // ! Set type of project
  await rearguardConfig.setType("lib");

  await updatePkgFiles(CWD);

  // ! Set scripts
  // ! Create entry points: index.tsx, export.ts, vendors.ts
  // ! Set configuration files: tsconfig.json, tests/tsconfig.json, .eslintrc, .gitignore
  // ! Apply static templates to project
  // ! Check/Install dependencies
  // ! Set dll entry name which depend on pkg.name
  await commonPreset(flags, CWD);
}
