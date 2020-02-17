import { group_command_executor } from "./executor";
import {
  DLL_BUNDLE_DIR_NAME,
  DISTRIBUTIVE_DIR_NAME,
  LIB_BUNDLE_DIR_NAME,
  LIB_DIR_NAME,
} from "../../const";

export const group_clear_component = async (): Promise<void> => {
  await group_command_executor(
    [
      "rm",
      "-rf",
      "./node_modules",
      "package-lock.json",
      DISTRIBUTIVE_DIR_NAME,
      DLL_BUNDLE_DIR_NAME,
      LIB_BUNDLE_DIR_NAME,
      LIB_DIR_NAME,
    ],
    true,
  );
};
