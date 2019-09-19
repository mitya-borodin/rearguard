import * as fs from "fs";
import * as path from "path";
import { RearguardConfig } from "../../../configs/RearguardConfig";
import { mkdir } from "../../../helpers/mkdir";

// TODO Add logging;
export const createEntries = async (CWD: string): Promise<void> => {
  const rearguardConfig = new RearguardConfig(CWD);

  const context = rearguardConfig.getContext();
  const entry = rearguardConfig.getEntry();
  const libEntry = rearguardConfig.getLibEntry();
  const dllEntry = rearguardConfig.getDllEntry();

  const contextPath = path.resolve(CWD, context);
  const entryPath = path.resolve(contextPath, entry);
  const libEntryPath = path.resolve(contextPath, libEntry);
  const dllEntryPath = path.resolve(contextPath, dllEntry);

  await mkdir(contextPath);

  if (fs.existsSync(contextPath)) {
    if (!fs.existsSync(contextPath)) {
      fs.writeFileSync(entryPath, `console.log("Entry point for launch in browser");`);
    }

    if (!fs.existsSync(libEntryPath)) {
      fs.writeFileSync(libEntryPath, `// Entry point for export library API`);
    }

    if (!fs.existsSync(dllEntryPath)) {
      fs.writeFileSync(dllEntryPath, `// Entry point for collect vendors deps into dll library`);
    }
  }
};
