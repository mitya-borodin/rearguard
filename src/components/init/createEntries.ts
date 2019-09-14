import * as fs from "fs";
import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { mkdir } from "../../helpers/mkdir";
import { IRearguardConfig } from "../../interfaces/configs/IRearguardConfig";

export const createEntries = async (CWD: string): Promise<void> => {
  const rearguardConfig: IRearguardConfig = new RearguardConfig(CWD);

  const context: string = rearguardConfig.getContext();
  const entry: string = rearguardConfig.getEntry();
  const libEntry: string = rearguardConfig.getLibEntry();
  const dllEntry: string = rearguardConfig.getDllEntry();

  await mkdir(path.resolve(CWD, context));

  if (fs.existsSync(path.resolve(CWD, context))) {
    fs.writeFileSync(path.resolve(CWD, context, entry), `console.log("Entry point for launch in browser");`);
    fs.writeFileSync(path.resolve(CWD, context, libEntry), `// Entry point for export library API`);
    fs.writeFileSync(path.resolve(CWD, context, dllEntry), `// Entry point for collect vendors deps into dll library`);
  }
};
