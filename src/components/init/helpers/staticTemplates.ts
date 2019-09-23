import { editorConfigTemplate } from "../../../templates/editorConfig";
import { postCSSConfigTemplate } from "../../../templates/postCssConfig";
import { typingNonTypescriptModulesTemplate } from "../../../templates/typingNonTypescriptModules";

// TODO Add logging;
export const staticTemplates = async (options: { force: boolean }): Promise<void> => {
  await typingNonTypescriptModulesTemplate.render(options);
  await postCSSConfigTemplate.render(options);
  await editorConfigTemplate.render(options);
};
