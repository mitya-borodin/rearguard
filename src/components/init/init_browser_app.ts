import { RearguardConfig } from "../../configs/RearguardConfig";
import {
  dockerComposeExampleTemplate,
  dockerIgnoreTemplate,
  frontEndDockerfileTemplate,
} from "../../templates/docker";
import { nginxTemplate } from "../../templates/nginx";
import { commonPreset } from "../procedures/commonPreset";
import { RearguardDevConfig } from "../../configs/RearguardDevConfig";
import { mkdir } from "../../helpers/mkdir";
import { getPublicDirPath } from "../../helpers/bundleNaming";
import { indexHtmlTemplate, copyPublicAssets } from "../../templates/indexHtml";
import { initPackage } from "../procedures/initPackage";

export async function init_browser_app(flags: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();

  await initPackage(CWD);

  // * Create rearguard config
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardDevConfig(CWD);

  // ! Set status.
  await rearguardLocalConfig.setBuildStatus("init");

  // ! Set environment in which the code will work
  await rearguardConfig.setRuntime("browser");

  // ! Set type of project
  await rearguardConfig.setType("app");

  // ! Set buildAssets/Dockerfile
  await frontEndDockerfileTemplate.render(flags);

  // ! buildAssets/docker-compose.yml
  await dockerComposeExampleTemplate.render(flags);

  // ! buildAssets/nginx.conf
  await nginxTemplate.render(flags);

  // ! Create .dockerignore
  await dockerIgnoreTemplate.render(flags);

  // ! Set scripts
  // ! Create entry points: index.tsx, export.ts, vendors.ts
  // ! Set configuration files: tsconfig.json, tests/tsconfig.json, .eslintrc, .gitignore
  // ! Apply static templates to project
  // ! Check/Install dependencies
  // ! Set dll entry name which depend on pkg.name
  await commonPreset(flags, CWD);

  // ! Create index.html
  mkdir(getPublicDirPath(CWD));
  await copyPublicAssets(CWD, flags.force);
  await indexHtmlTemplate.render(flags);
}
