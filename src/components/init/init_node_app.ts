import { commonPreset } from "../actions/commonPreset";
import { RearguardConfig } from "../../configs/RearguardConfig";

export async function init_node_app(flags: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config;
  const rearguardConfig = new RearguardConfig(CWD);

  // ! Set environment in which the code will work;
  await rearguardConfig.setRuntime("node");

  // ! Set type of project;
  await rearguardConfig.setType("app");

  // ! Set scripts;
  // ! Create entry points: index.tsx, export.ts, vendors.ts;
  // ! Set configuration files: tsconfig.json, tests/tsconfig.json, .eslintrc, .gitignore;
  // ! Apply static templates to project;
  // ! Check/Install dependencies.
  await commonPreset(flags, CWD);
}
