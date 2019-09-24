import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { TypescriptConfig } from "../../configs/TypescriptConfig";
import {
  LIST_OF_LOAD_ON_DEMAND,
  TESTS_DIR_NAME,
  LIB_DIR_NAME,
  LIB_BUNDLE_DIR_NAME,
  DLL_BUNDLE_DIR_NAME,
  DISTRIBUTIVE_DIR_NAME,
} from "../../const";
import { gitignoreTemplate } from "../../templates/gitignore";
import { lintTemplate } from "../../templates/lint";
import { createEntries } from "./createEntries";

// TODO Add logging;
export const dynamicTemplates = async (
  options: { force: boolean },
  CWD: string = process.cwd(),
): Promise<void> => {
  const CWDForTests = path.resolve(CWD, TESTS_DIR_NAME);
  const rearguardConfig = new RearguardConfig(CWD);
  const typescriptConfig = new TypescriptConfig(CWD);
  const typescriptForTestsConfig = new TypescriptConfig(CWDForTests);

  const binPath = path.resolve(CWD, "bin");
  const baseUrl = path.resolve(CWD, rearguardConfig.getContext());

  await createEntries(CWD);

  await typescriptConfig.init(rearguardConfig.isOverwriteTSConfig() || options.force);
  await typescriptConfig.setBaseUrl(baseUrl);
  await typescriptConfig.setInclude([binPath, baseUrl]);
  await typescriptConfig.setExclude([
    "node_modules",
    path.resolve(CWD, DISTRIBUTIVE_DIR_NAME),
    path.resolve(CWD, DLL_BUNDLE_DIR_NAME),
    path.resolve(CWD, LIB_BUNDLE_DIR_NAME),
    path.resolve(CWD, LIB_DIR_NAME),
  ]);

  await typescriptForTestsConfig.init(rearguardConfig.isOverwriteTSTestConfig() || options.force);
  await typescriptForTestsConfig.setBaseUrl(baseUrl);
  await typescriptForTestsConfig.setInclude([binPath, baseUrl, CWDForTests]);
  await typescriptForTestsConfig.setExclude(["node_modules"]);

  await lintTemplate.render({ force: rearguardConfig.isOverwriteTSLintConfig() || options.force });

  await gitignoreTemplate.render({
    publish_to_git: rearguardConfig.isPublishToGit(),
    list_for_load_on_demand: LIST_OF_LOAD_ON_DEMAND,
    force: rearguardConfig.isOverwriteGitIgnore() || options.force,
  });
};
