import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { editorConfigTemplate } from "../../templates/editorConfig";
import { postCSSConfigTemplate } from "../../templates/postCssConfig";
import { prettierTemplate } from "../../templates/prettierrc";
import { typingNonTypescriptModulesTemplate } from "../../templates/typingNonTypescriptModules";

// TODO Add logging;
export const staticTemplates = async (
  options: { force: boolean },
  CWD: string = process.cwd(),
): Promise<void> => {
  // * Create rearguard configs;
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare path to project context;
  const context = path.resolve(CWD, rearguardConfig.getContext());
  const isBrowser = rearguardConfig.isBrowser();

  if (isBrowser) {
    // ! Create type declaration for non typescript modules like a .css, .png, etc.
    await typingNonTypescriptModulesTemplate.render(options, context);
  }

  // ! Create file for including postcss plugins;
  await postCSSConfigTemplate.render(options);

  // ! Create .prettier in json format.
  await prettierTemplate.render(options);

  // ! Create .editorconfig.
  await editorConfigTemplate.render(options);
};
