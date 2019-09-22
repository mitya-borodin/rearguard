import { RearguardConfig } from "../../../configs/RearguardConfig";
import { LIST_OF_LOAD_ON_DEMAND } from "../../../const";
import { editorConfigTemplate } from "../../../templates/editorConfig";
import { gitignoreTemplate } from "../../../templates/gitignore";
import { postCSSConfigTemplate } from "../../../templates/postCssConfig";
import { typingNonTypescriptModulesTemplate } from "../../../templates/typingNonTypescriptModules";

// TODO Add logging;
export const defaultTemplates = async (CWD: string, options: { force: boolean }): Promise<void> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const publish_to_git = rearguardConfig.isPublishToGit();

  await typingNonTypescriptModulesTemplate.render(options);
  await gitignoreTemplate.render({
    publish_to_git,
    list_for_load_on_demand: LIST_OF_LOAD_ON_DEMAND,
    ...options,
  });
  await editorConfigTemplate.render(options);
  await postCSSConfigTemplate.render(options);
};
