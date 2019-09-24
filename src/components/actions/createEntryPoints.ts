import * as fs from "fs";
import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { mkdir } from "../../helpers/mkdir";

// TODO Add logging;
export const createEntryPoints = async (CWD: string): Promise<void> => {
  // * Create rearguard configs;
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare data for creating files;
  const context = rearguardConfig.getContext();
  const entry = rearguardConfig.getEntry();
  const libEntry = rearguardConfig.getLibEntry();
  const dllEntry = rearguardConfig.getDllEntry();
  const isBrowser = rearguardConfig.isBrowser();
  const isLib = rearguardConfig.isLib();

  // * Prepare data for creating files;
  const contextPath = path.resolve(CWD, context);
  const entryPath = path.resolve(contextPath, entry);
  const libEntryPath = path.resolve(contextPath, libEntry);
  const dllEntryPath = path.resolve(contextPath, dllEntry);

  // ! Create context directory;
  await mkdir(contextPath);

  if (fs.existsSync(contextPath)) {
    if (isBrowser && !fs.existsSync(entryPath)) {
      fs.writeFileSync(entryPath, `console.log("Entry point for launch in browser");`);
    }

    if (isLib && !fs.existsSync(libEntryPath)) {
      fs.writeFileSync(libEntryPath, `// Entry point for export library API`);
    }

    if (isBrowser && !fs.existsSync(dllEntryPath)) {
      fs.writeFileSync(dllEntryPath, `// Entry point for collect vendors deps into dll library`);
    }
  }
};
