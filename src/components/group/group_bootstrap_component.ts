import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { processQueue } from "../../helpers/processQueue";
import { typingNonTypescriptModulesTemplate } from "../../templates/typingNonTypescriptModules";
import { getSortedListOfMonoComponents } from "../procedures/getSortedListOfDependencies";
import { group_command_executor } from "./executor";
import {
  DISTRIBUTIVE_DIR_NAME,
  DLL_BUNDLE_DIR_NAME,
  LIB_BUNDLE_DIR_NAME,
  LIB_DIR_NAME,
} from "../../const";

export const group_bootstrap_component = async (options: {
  only_dev: boolean;
  debug: boolean;
}): Promise<void> => {
  const CWD = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const name = rearguardConfig.getName();
  const components = rearguardConfig.getComponents();

  await processQueue.getInQueue(name);

  const sortedListOfMonoComponents = await getSortedListOfMonoComponents(CWD, components);

  for (const pathToComponent of sortedListOfMonoComponents) {
    const rearguardConfigItem = new RearguardConfig(pathToComponent);
    const context = path.resolve(pathToComponent, rearguardConfig.getContext());

    const isBrowser = rearguardConfigItem.isBrowser();
    const isIsomorphic = rearguardConfigItem.isIsomorphic();

    if (isBrowser || isIsomorphic) {
      // ! Create type declaration for non typescript modules like a .css, .png, etc.
      await typingNonTypescriptModulesTemplate.render(options, context);
    }
  }

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
  await group_command_executor(["npm", "install"], true);
  await group_command_executor(["npm", "link"], true);
  await group_command_executor(["npm", "run", "sync", "--", "--bypass_the_queue"], true);
  await group_command_executor(["npm", "run", "validate"], false);
  await group_command_executor(
    [
      "npm",
      "run",
      "build",
      ...(options.debug ? ["--", "--debug"] : []),
      ...(options.only_dev ? ["--", "--only_dev"] : []),
      ...["--", "--bypass_the_queue"],
    ],
    true,
  );

  await processQueue.getOutQueue(name);
};
