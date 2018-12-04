import { monorepoConfig } from "../../config/monorepo";
import { registryCredentialsConfig } from "../../config/registryCredentials";
import { monorepoGitIgnore } from "../../meta/monorepo_gitignore";

export async function init() {
  monorepoGitIgnore.init(true);
  monorepoConfig.init();
  registryCredentialsConfig.init();
}
