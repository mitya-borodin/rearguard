import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { TypescriptConfig } from "../../configs/TypescriptConfig";
import {
  DISTRIBUTIVE_DIR_NAME,
  DLL_BUNDLE_DIR_NAME,
  LIB_BUNDLE_DIR_NAME,
  LIB_DIR_NAME,
  LIST_OF_LOAD_ON_DEMAND,
  TESTS_DIR_NAME,
} from "../../const";
import { gitignoreTemplate } from "../../templates/gitignore";
import {
  nodeLibLintTemplate,
  browserOrIsomorphicLintTemplate,
  lintIgnoreTemplate,
} from "../../templates/lint";

// TODO Add logging;
export const setConfigs = async (
  options: { force: boolean },
  CWD: string = process.cwd(),
): Promise<void> => {
  // * Current work directory for test;
  const CWDForTests = path.resolve(CWD, TESTS_DIR_NAME);

  // * Create configs;
  const rearguardConfig = new RearguardConfig(CWD);
  const typescriptConfig = new TypescriptConfig(CWD);
  const typescriptForTestsConfig = new TypescriptConfig(CWDForTests);
  const isNode = rearguardConfig.isNode();
  const isBrowser = rearguardConfig.isBrowser();
  const isIsomorphic = rearguardConfig.isIsomorphic();

  // * Prepare data for configuration;
  const binPath = path.resolve(CWD, "bin");
  const baseUrl = path.resolve(CWD, rearguardConfig.getContext());
  const exclude: string[] = [
    "node_modules",
    path.resolve(CWD, DISTRIBUTIVE_DIR_NAME),
    path.resolve(CWD, DLL_BUNDLE_DIR_NAME),
    path.resolve(CWD, LIB_BUNDLE_DIR_NAME),
    path.resolve(CWD, LIB_DIR_NAME),
  ];

  // ! Typescript config for developing and building;
  await typescriptConfig.init(rearguardConfig.isOverwriteTSConfig() || options.force);
  await typescriptConfig.setBaseUrl(baseUrl);
  await typescriptConfig.setInclude([...(isNode ? [binPath] : []), baseUrl]);
  await typescriptConfig.setExclude(exclude);

  // ! Typescript config for testing;
  await typescriptForTestsConfig.init(rearguardConfig.isOverwriteTSTestConfig() || options.force);
  await typescriptForTestsConfig.setBaseUrl(baseUrl);
  await typescriptForTestsConfig.setInclude([...(isNode ? [binPath] : []), baseUrl, CWDForTests]);
  await typescriptForTestsConfig.setExclude(exclude);

  // ! Create lint configuration;
  if (isNode) {
    await nodeLibLintTemplate.render({
      force: rearguardConfig.isOverwriteLintConfig() || options.force,
    });
  }

  if (isBrowser || isIsomorphic) {
    await browserOrIsomorphicLintTemplate.render({
      force: rearguardConfig.isOverwriteLintConfig() || options.force,
    });
  }

  lintIgnoreTemplate.render({
    force: rearguardConfig.isOverwriteLintConfig() || options.force,
  });

  // ! Create .gitignore configuration;
  await gitignoreTemplate.render({
    publish_to_git: rearguardConfig.isPublishToGit(),
    list_for_load_on_demand: LIST_OF_LOAD_ON_DEMAND,
    force: rearguardConfig.isOverwriteGitIgnore() || options.force,
  });
};
