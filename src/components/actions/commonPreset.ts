import { createEntryPoints } from "./createEntryPoints";
import { setConfigs } from "./setConfigs";
import { setScripts } from "./setScripts";
import { staticTemplates } from "./staticTemplates";
import { checkDependencies } from "./checkDependencies";

// TODO Add logging;
export const commonPreset = async (
  flags: { force: boolean },
  CWD: string = process.cwd(),
): Promise<void> => {
  // ! Set scripts;
  await setScripts(CWD);

  // ! Create entry points: index.tsx, export.ts, vendors.ts;
  await createEntryPoints(CWD);

  // ! Set configuration files: tsconfig.json, tests/tsconfig.json, .eslintrc, .gitignore;
  await setConfigs(flags, CWD);

  // ! Apply static templates to project;
  await staticTemplates(flags, CWD);

  // ! Check/Install dependencies.
  await checkDependencies(CWD);
};
