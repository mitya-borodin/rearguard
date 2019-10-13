import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import * as fs from "fs";

export const hasVendorImports = async (CWD: string): Promise<boolean> => {
  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);

  const dllEntryPath = path.resolve(
    CWD,
    rearguardConfig.getContext(),
    rearguardConfig.getDllEntry(),
  );

  if (fs.existsSync(dllEntryPath)) {
    const content = fs.readFileSync(dllEntryPath);

    return /import "[@a-zA-Z/.-]*";/g.test(content.toString());
  }

  return false;
};
