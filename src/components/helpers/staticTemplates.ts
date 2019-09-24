import * as path from "path";
import { typingNonTypescriptModulesTemplate } from "../../templates/typingNonTypescriptModules";
import { postCSSConfigTemplate } from "../../templates/postCssConfig";
import { prettierTemplate } from "../../templates/prettierrc";
import { editorConfigTemplate } from "../../templates/editorConfig";
import { RearguardConfig } from "../../configs/RearguardConfig";

// TODO Add logging;
export const staticTemplates = async (
  options: { force: boolean },
  CWD: string = process.cwd(),
): Promise<void> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const context = path.resolve(CWD, rearguardConfig.getContext());

  await typingNonTypescriptModulesTemplate.render(options, context);
  await postCSSConfigTemplate.render(options);
  await prettierTemplate.render(options);
  await editorConfigTemplate.render(options);
};
