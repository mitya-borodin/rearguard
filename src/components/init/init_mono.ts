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
    await mkdir(path.resolve(CWD, "packages"));
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
  await rearguardConfig.setComponents(["packages"]);
  await rearguardConfig.setScripts(
    {
      bootstrap: "rearguard group bootstrap",

      start: "rearguard group start",
      build: "rearguard group build",
      test: "rearguard group test",
      publish: "rearguard group publish",

      sync: "rearguard group sync",
      validate: "rearguard group validate",
      ["lint-fix"]: "rearguard group lint-fix",
      ["make-prettier"]: "rearguard group make-prettier",

      refresh: "rearguard group refresh",
      clear: "rearguard group clear",
      install: "rearguard group install",
      link: "rearguard group link",
      lint: "rearguard group lint",

      ["validate-prettiness"]: "rearguard group validate-prettiness",
      typecheck: "rearguard group typecheck",
    },
    true,
  );
}
