import execa from "execa";
import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { mkdir } from "../../helpers/mkdir";
import { vsCodeExtensionsTemplate, vsCodeSettingsTemplate } from "../../templates/vsCode";
import { initPackage } from "../procedures/initPackage";
import { prettierTemplate } from "../../templates/prettierrc";
import { prettierIgnoreTemplate } from "../../templates/prettierignore";
import { gitignoreTemplate } from "../../templates/gitignore";
import { LIST_OF_LOAD_ON_DEMAND } from "../../const";

export async function init_mono(flags: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();
  const execaOptions: execa.Options = {
    stdout: "inherit",
    stderr: "inherit",
  };

  await initPackage(CWD);
  await execa("npm", ["install", "-D", "husky"], execaOptions);
  await mkdir(path.resolve(CWD, "components"));

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
    list_for_load_on_demand: LIST_OF_LOAD_ON_DEMAND,
    force: flags.force,
  });

  const rearguardConfig = new RearguardConfig(CWD);
  await rearguardConfig.setType("mono");
  await rearguardConfig.setComponents(["components/*"]);
  await rearguardConfig.setScripts(
    {
      bootstrap: "npx rearguard group bootstrap",
      clear: "npx rearguard group clear",
      install: "npx rearguard group install",
      link: "npx rearguard group link",
      lint: "npx rearguard group lint",
      ["lint-fix"]: "npx rearguard group lint-fix",
      typecheck: "npx rearguard group typecheck",
      ["validate-prettiness"]: "npx rearguard group validate-prettiness",
      validate: "npx rearguard group validate",
      ["make-prettier"]: "npx rearguard group make-prettier",
      build: "npx rearguard group build",
      test: "npx rearguard group test",
      publish: "npx rearguard group publish",
      refresh: "npx rearguard group refresh",
    },
    true,
  );
}
