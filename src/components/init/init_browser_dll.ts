import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { createEntryPoints } from "../procedures/createEntryPoints";
import { TypescriptConfig } from "../../configs/TypescriptConfig";
import { DISTRIBUTIVE_DIR_NAME, DLL_BUNDLE_DIR_NAME, LIST_OF_LOAD_ON_DEMAND } from "../../const";
import { gitignoreTemplate } from "../../templates/gitignore";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { prettierIgnoreTemplate } from "../../templates/prettierignore";

export async function init_browser_dll(options: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);
  const typescriptConfig = new TypescriptConfig(CWD);

  const baseUrl = path.resolve(CWD, rearguardConfig.getContext());
  const exclude: string[] = [
    "node_modules",
    path.resolve(CWD, DISTRIBUTIVE_DIR_NAME),
    path.resolve(CWD, DLL_BUNDLE_DIR_NAME),
  ];

  // ! Set status.
  await rearguardLocalConfig.setBuildStatus("init");

  // ! Set environment in which the code will work
  await rearguardConfig.setRuntime("browser");

  // ! Set type of project
  await rearguardConfig.setType("dll");

  // ! Set files for project
  await rearguardConfig.setFiles([DLL_BUNDLE_DIR_NAME]);

  // ! Create .prettierignore in json format.
  await prettierIgnoreTemplate.render(options);

  // ! Set scripts;
  await rearguardConfig.setScripts({
    build: "npx rearguard build",
  });

  // ! Create entry points: index.tsx, export.ts, vendors.ts;
  await createEntryPoints(CWD);

  // ! Typescript config for developing and building;
  await typescriptConfig.init(rearguardConfig.isOverwriteTSConfig());
  await typescriptConfig.setBaseUrl(baseUrl);
  await typescriptConfig.setInclude([baseUrl]);
  await typescriptConfig.setExclude(exclude);

  // ! Create .gitignore configuration;
  await gitignoreTemplate.render({
    publish_to_git: rearguardConfig.isPublishToGit(),
    list_for_load_on_demand: LIST_OF_LOAD_ON_DEMAND,
    force: rearguardConfig.isOverwriteGitIgnore() || options.force,
  });
}
