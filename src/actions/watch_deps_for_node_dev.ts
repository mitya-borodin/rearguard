import { ordering_project_deps } from "../components/project_deps/ordering_project_deps";
import { sync_with_linked_modules } from "../components/project_deps/sync_with_linked_modules";
import { watch_deps } from "../components/watch_deps";
import { prettierConfig } from "../config/prettier";
import { tsLintConfig } from "../config/tslint";
import { typescriptConfig } from "../config/typescript";
import { dockerIgnore } from "../meta/dockerignore";
import { editorConfig } from "../meta/editorConfig";
import { gitIgnore } from "../meta/gitignore";
import { npmrc } from "../meta/Npmrc";

async function watch_deps_for_node_dev() {
  // Config file
  typescriptConfig.init(true);
  tsLintConfig.init(true);
  prettierConfig.init(true);

  // Meta files init
  dockerIgnore.init(true);
  gitIgnore.init(true);
  editorConfig.init(true);
  npmrc.init(true);

  console.log("");

  await ordering_project_deps();
  await sync_with_linked_modules();

  watch_deps();
}

watch_deps_for_node_dev();
