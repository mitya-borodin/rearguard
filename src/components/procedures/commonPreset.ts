import { createEntryPoints } from "./createEntryPoints";
import { setConfigs } from "./setConfigs";
import { setScripts } from "./setScripts";
import { staticTemplates } from "./staticTemplates";
import { checkDependencies } from "./checkDependencies";
import { RearguardConfig } from "../../configs/RearguardConfig";

// TODO Add logging;
export const commonPreset = async (
  flags: { force: boolean },
  CWD: string = process.cwd(),
): Promise<void> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const packageName = rearguardConfig.getName();

  // ! Set scripts;
  await setScripts(CWD);

  // ! Create entry points: index.tsx, export.ts, vendors.ts;
  await createEntryPoints(CWD);

  // ! Set configuration files: tsconfig.json, tests/tsconfig.json, .eslintrc, .gitignore;
  await setConfigs(flags, CWD);

  // ! Apply static templates to project;
  await staticTemplates(flags, CWD);

  // ! Check/Install dependencies.
  await checkDependencies(CWD, flags.force);

  // ! Set dll entry name which depend on pkg.name
  rearguardConfig.setDllEntry(`${packageName}_vendors.ts`);
};
