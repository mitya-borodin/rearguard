import { RearguardConfig } from "../../configs/RearguardConfig";
import { TypescriptConfig } from "../../configs/TypescriptConfig";
import {
  BUILD_ASSETS_DIR_NAME,
  DISTRIBUTIVE_DIR_NAME,
  DLL_BUNDLE_DIR_NAME,
  LIB_BUNDLE_DIR_NAME,
  LIB_DIR_NAME,
  LIST_OF_LOAD_ON_DEMAND,
  TESTS_DIR_NAME,
} from "../../const";
import { gitignoreTemplate } from "../../templates/gitignore";
import {
  browserOrIsomorphicLintTemplate,
  lintIgnoreTemplate,
  nodeLibLintTemplate,
} from "../../templates/lint";

// TODO Add logging;
export const setConfigs = async (
  options: { force: boolean },
  CWD: string = process.cwd(),
): Promise<void> => {
  // * Create configs;
  const rearguardConfig = new RearguardConfig(CWD);
  const typescriptConfig = new TypescriptConfig(CWD);
  const typescriptConfigForJest = new TypescriptConfig(CWD, "tsconfig.jest.json");
  const isNode = rearguardConfig.isNode();
  const isBrowser = rearguardConfig.isBrowser();
  const isIsomorphic = rearguardConfig.isIsomorphic();
  const isLib = rearguardConfig.isLib();
  const isApp = rearguardConfig.isApp();

  // * Prepare data for configuration;
  const context = rearguardConfig.getContext();
  const bin = rearguardConfig.getBin();

  // * Include
  const include: Set<string> = new Set([context]);
  const includeForJest: Set<string> = new Set([
    `${context}/**/*`,
    `${TESTS_DIR_NAME}/**/*`,
    `__${TESTS_DIR_NAME}__/**/*`,
  ]);

  // * Exclude
  const exclude: Set<string> = new Set(["node_modules"]);

  if (isApp) {
    exclude.add(DISTRIBUTIVE_DIR_NAME);
  }

  if (isBrowser || isIsomorphic) {
    exclude.add(DLL_BUNDLE_DIR_NAME);
    exclude.add(LIB_BUNDLE_DIR_NAME);
    exclude.add(LIB_DIR_NAME);
  }

  if (isNode) {
    if (isLib) {
      exclude.add(LIB_DIR_NAME);
    }

    if (isApp) {
      include.add(bin);
      includeForJest.add(`${bin}/**/*`);
    }
  }

  if ((isNode && isApp) || (isBrowser && isApp)) {
    exclude.add(BUILD_ASSETS_DIR_NAME);
  }

  // ! Typescript config for developing and building;
  await typescriptConfig.init(rearguardConfig.isOverwriteTSConfig() || options.force);
  await typescriptConfig.setBaseUrl(context);
  await typescriptConfig.setInclude(Array.from(include));
  await typescriptConfig.setExclude([
    ...Array.from(exclude),
    `${context}/**/*.test.ts`,
    `${context}/**/*.spec.ts`,
    `__${TESTS_DIR_NAME}__/**/*`,
  ]);

  // ! Typescript config for Jest;
  await typescriptConfigForJest.init(rearguardConfig.isOverwriteTSTestConfig() || options.force);
  await typescriptConfigForJest.setBaseUrl(context);
  await typescriptConfigForJest.setInclude(Array.from(includeForJest));
  await typescriptConfigForJest.setExclude(Array.from(exclude));
  await typescriptConfigForJest.setTypes(["jest"]);

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
