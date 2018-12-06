import { monorepoConfig } from "../../config/monorepo";
import { monorepoGitIgnore } from "../../meta/monorepo_gitignore";

export async function init() {
  monorepoGitIgnore.init(true);
  monorepoConfig.init();
}
