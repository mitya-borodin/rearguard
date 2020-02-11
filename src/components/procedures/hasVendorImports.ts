import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import fs from "fs";
import { promisify } from "util";

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);

export const hasVendorImports = async (CWD: string): Promise<boolean> => {
  try {
    // * Create rearguard config
    const rearguardConfig = new RearguardConfig(CWD);

    const dllEntryPath = path.resolve(
      CWD,
      rearguardConfig.getContext(),
      rearguardConfig.getDllEntry(),
    );

    if (await exists(dllEntryPath)) {
      const content = await readFile(dllEntryPath);

      return /import "[@a-zA-Z/.-]*";/g.test(content.toString());
    }
  } catch (error) {
    console.trace(error);
  }

  return false;
};
