import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, LIB_DIR_NAME } from "../../const";
import { hasVendorImports } from "./hasVendorImports";

export const updatePkgFiles = async (CWD: string): Promise<void> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const libEntry = rearguardConfig.getLibEntry();
  const isNode = rearguardConfig.isNode();
  const isLib = rearguardConfig.isLib();
  const hasDLL = await hasVendorImports(CWD);

  if (isNode && isLib) {
    await rearguardConfig.setFiles([LIB_DIR_NAME]);
  } else {
    await rearguardConfig.setFiles([
      ...(hasDLL ? [DLL_BUNDLE_DIR_NAME] : []),
      LIB_BUNDLE_DIR_NAME,
      LIB_DIR_NAME,
    ]);
  }

  await rearguardConfig.setMain(
    `./${LIB_DIR_NAME}/${libEntry.replace(path.extname(libEntry), ".js")}`,
  );
  await rearguardConfig.setTypes(
    `./${LIB_DIR_NAME}/${libEntry.replace(path.extname(libEntry), ".d.ts")}`,
  );
};
