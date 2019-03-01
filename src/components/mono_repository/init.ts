import { envConfig } from "../../config/env";
import { monorepoConfig } from "../../config/monorepo";
import { monorepoGitIgnore } from "../../meta/monorepo_gitignore";

export async function init() {
  monorepoGitIgnore.init(envConfig, true);
  monorepoConfig.init();
}
