import * as fs from "fs";
import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { mkdir } from "../../helpers/mkdir";
import { BIN_DIR_NAME, BIN_FILE_NAME } from "../../const";

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
  const isNode = rearguardConfig.isNode();
  const isLib = rearguardConfig.isLib();
  const isApp = rearguardConfig.isApp();

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

  if (isNode && isApp) {
    // * Prepare  node app data.
    const binDirPath = path.resolve(CWD, BIN_DIR_NAME);
    const binFilePath = path.resolve(binDirPath, BIN_FILE_NAME);

    // ! Create bin directory;
    await mkdir(binDirPath);

    if (!fs.existsSync(binFilePath)) {
      // ! Create bin file;
      fs.writeFileSync(binFilePath, `console.log("Entry point for back end implementation.");`);
    }
  }
};
