import { RearguardConfig } from "../../configs/RearguardConfig";
import { RearguardDevConfig } from "../../configs/RearguardDevConfig";
import { TypescriptConfig } from "../../configs/TypescriptConfig";
import { DLL_BUNDLE_DIR_NAME, LIST_OF_LOAD_ON_DEMAND } from "../../const";
import { gitignoreTemplate } from "../../templates/gitignore";
import { prettierIgnoreTemplate } from "../../templates/prettierignore";
import { createEntryPoints } from "../procedures/createEntryPoints";
import { initPackage } from "../procedures/initPackage";
import { checkDependencies } from "../procedures/checkDependencies";

export async function init_browser_dll(options: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();

  await initPackage(CWD);

  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardDevConfig(CWD);
  const typescriptConfig = new TypescriptConfig(CWD);

  const context = rearguardConfig.getContext();
  const exclude: string[] = ["node_modules", DLL_BUNDLE_DIR_NAME];

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
  await rearguardConfig.setScripts(
    {
      build: "rearguard build",
      sync: "rearguard sync",
      refresh: "rearguard refresh",
    },
    options.force,
  );

  // ! Create entry points: index.tsx, export.ts, vendors.ts;
  await createEntryPoints(CWD);

  // ! Typescript config for developing and building;
  await typescriptConfig.init(rearguardConfig.isOverwriteTSConfig());
  await typescriptConfig.setBaseUrl(context);
  await typescriptConfig.setInclude([context]);
  await typescriptConfig.setExclude(exclude);

  // ! Create .gitignore configuration;
  await gitignoreTemplate.render({
    publish_to_git: rearguardConfig.isPublishToGit(),
    list_for_load_on_demand: LIST_OF_LOAD_ON_DEMAND,
    force: rearguardConfig.isOverwriteGitIgnore() || options.force,
  });

  // ! Check/Install dependencies.
  await checkDependencies(CWD, options.force);
}
