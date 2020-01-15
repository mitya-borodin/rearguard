import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { postCSSConfigTemplate } from "../../templates/postCssConfig";
import { prettierIgnoreTemplate } from "../../templates/prettierignore";
import { prettierTemplate } from "../../templates/prettierrc";
import { typingNonTypescriptModulesTemplate } from "../../templates/typingNonTypescriptModules";
import { vsCodeExtensionsTemplate, vsCodeSettingsTemplate } from "../../templates/vsCode";
import { stylelintrcTemplate } from "../../templates/stylelint";
import { stylelintIgnoreTemplate } from "../../templates/stylelintignore";

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
  const isIsomorphic = rearguardConfig.isIsomorphic();

  if (isBrowser || isIsomorphic) {
    await stylelintrcTemplate.render(options, CWD);
    await stylelintIgnoreTemplate.render(options, CWD);

    // ! Create type declaration for non typescript modules like a .css, .png, etc.
    await typingNonTypescriptModulesTemplate.render(options, context);
  }

  // ! Create file for including postcss plugins;
  await postCSSConfigTemplate.render(options);

  // ! Create .prettier in json format.
  await prettierTemplate.render(options);

  // ! Create .prettierignore in json format.
  await prettierIgnoreTemplate.render(options);

  // ! Create .vscode/settings.json.
  await vsCodeSettingsTemplate.render(options);

  // ! Create .vscode/extensions.json.
  await vsCodeExtensionsTemplate.render(options);
};
