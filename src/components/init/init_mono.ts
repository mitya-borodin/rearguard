import execa from "execa";
import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { LIST_OF_MODULES_WHICH_LOAD_ON_DEMAND } from "../../const";
import { mkdir } from "../../helpers/mkdir";
import { gitignoreTemplate } from "../../templates/gitignore";
import { prettierIgnoreTemplate } from "../../templates/prettierignore";
import { prettierTemplate } from "../../templates/prettierrc";
import { vsCodeExtensionsTemplate, vsCodeSettingsTemplate } from "../../templates/vsCode";
import { initPackage } from "../procedures/initPackage";

export async function init_mono(flags: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();
  const execaOptions: execa.Options = {
    stdout: "inherit",
    stderr: "inherit",
  };

  try {
    await initPackage(CWD);
    await execa("npm", ["install", "-D", "-E", "husky"], execaOptions);
    await mkdir(path.resolve(CWD, "components"));
  } catch (error) {
    console.error(error);
  }

  // ! Create .vscode/settings.json.
  await vsCodeSettingsTemplate.render(flags);

  // ! Create .vscode/extensions.json.
  await vsCodeExtensionsTemplate.render(flags);

  // ! Create .prettier in json format.
  await prettierTemplate.render(flags);

  // ! Create .prettierignore in json format.
  await prettierIgnoreTemplate.render(flags);

  // ! Create .gitignore configuration;
  await gitignoreTemplate.render({
    publish_to_git: false,
    listOfModulesWhichLoadOnDemand: LIST_OF_MODULES_WHICH_LOAD_ON_DEMAND,
    force: flags.force,
  });

  const rearguardConfig = new RearguardConfig(CWD);
  await rearguardConfig.setType("mono");
  await rearguardConfig.setComponents(["components"]);
  await rearguardConfig.setScripts(
    {
      bootstrap: "rearguard group bootstrap",
      clear: "rearguard group clear",
      link: "rearguard group link",
      lint: "rearguard group lint",
      start: "rearguard group start",
      ["lint-fix"]: "rearguard group lint-fix",
      typecheck: "rearguard group typecheck",
      ["validate-prettiness"]: "rearguard group validate-prettiness",
      validate: "rearguard group validate",
      ["make-prettier"]: "rearguard group make-prettier",
      build: "rearguard group build",
      test: "rearguard group test",
      publish: "rearguard group publish",
      refresh: "rearguard group refresh",
      sync: "rearguard group sync",
    },
    true,
  );
}
