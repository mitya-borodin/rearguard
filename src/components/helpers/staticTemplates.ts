import { typingNonTypescriptModulesTemplate } from "../../templates/typingNonTypescriptModules";
import { postCSSConfigTemplate } from "../../templates/postCssConfig";
import { prettierTemplate } from "../../templates/prettierrc";
import { editorConfigTemplate } from "../../templates/editorConfig";

// TODO Add logging;
export const staticTemplates = async (options: { force: boolean }): Promise<void> => {
  await typingNonTypescriptModulesTemplate.render(options);
  await postCSSConfigTemplate.render(options);
  await prettierTemplate.render(options);
  await editorConfigTemplate.render(options);
};
