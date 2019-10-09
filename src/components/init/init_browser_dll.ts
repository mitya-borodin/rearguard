import { RearguardConfig } from "../../configs/RearguardConfig";
import { createEntryPoints } from "../procedures/createEntryPoints";

export async function init_browser_dll(): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);

  // ! Set environment in which the code will work
  await rearguardConfig.setRuntime("browser");

  // ! Set type of project
  await rearguardConfig.setType("dll");

  // ! Create entry points: index.tsx, export.ts, vendors.ts;
  await createEntryPoints(CWD);

  // ! Set scripts;
  await rearguardConfig.setScripts({
    build: "npx rearguard build",
  });
}
