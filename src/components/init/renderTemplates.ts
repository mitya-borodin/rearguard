import { RearguardConfig } from "../../configs/RearguardConfig";
import { IRearguardConfig } from "../../interfaces/configs/IRearguardConfig";
import {
  backEndDockerfileTemplate,
  dockerComposeExampleTemplate,
  dockerIgnoreTemplate,
  frontEndDockerfileTemplate,
} from "../../templates/docker";
import { editorConfigTemplate } from "../../templates/editorConfig";
import { gitignoreTemplate } from "../../templates/gitignore";
import { nginxTemplate } from "../../templates/nginx";
import { npmRcTemplate } from "../../templates/npmRc";
import { postCSSConfigTemplate } from "../../templates/postCssConfig";
import { typingNonTypescriptModulesTemplate } from "../../templates/typingNonTypescriptModules";

export const renderTemplates = async (CWD: string, options: { force: boolean }) => {
  const rearguardConfig: IRearguardConfig = new RearguardConfig(CWD);
  const publish_to_git: boolean = rearguardConfig.isPublishToGit();

  // TODO Set name of list_for_load_on_demand file;
  await gitignoreTemplate.render({ publish_to_git, list_for_load_on_demand: "", ...options });
  await dockerIgnoreTemplate.render(options);
  await backEndDockerfileTemplate.render(options);
  await frontEndDockerfileTemplate.render(options);
  await dockerComposeExampleTemplate.render(options);
  await nginxTemplate.render(options);
  await editorConfigTemplate.render(options);
  await npmRcTemplate.render(options);
  await postCSSConfigTemplate.render(options);
  await typingNonTypescriptModulesTemplate.render(options);
};
