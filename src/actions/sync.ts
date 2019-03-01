import { build_intermediate_dependencies } from "../components/build_intermediate_dependencies";
import { install_declared_deps } from "../components/project_deps/install_declared_deps";
import { ordering_project_deps } from "../components/project_deps/ordering_project_deps";
import { sync_with_linked_modules } from "../components/project_deps/sync_with_linked_modules";
import { watch_deps } from "../components/watch_deps";
import { envConfig } from "../config/env";
import { prettierConfig } from "../config/prettier";
import { rearguardConfig } from "../config/rearguard";
import { tsLintConfig } from "../config/tslint";
import { typescriptConfig } from "../config/typescript";
import { dockerIgnore } from "../meta/dockerignore";
import { editorConfig } from "../meta/editorConfig";
import { gitIgnore } from "../meta/gitignore";
import { npmrc } from "../meta/Npmrc";

async function sync() {
  await build_intermediate_dependencies(envConfig, rearguardConfig);

  // Config file
  typescriptConfig.init(true);
  tsLintConfig.init(true);
  prettierConfig.init(true);

  // Meta files init
  dockerIgnore.init(envConfig, true);
  gitIgnore.init(envConfig, true);
  editorConfig.init(envConfig, true);
  npmrc.init(envConfig, true);

  console.log("");

  await install_declared_deps(envConfig);
  await ordering_project_deps(envConfig);
  await sync_with_linked_modules(envConfig);

  if (envConfig.isWatch) {
    watch_deps(envConfig, rearguardConfig);
  }
}

sync();
