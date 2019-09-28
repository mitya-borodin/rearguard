import { RearguardConfig } from "../../configs/RearguardConfig";
import {
  dockerComposeExampleTemplate,
  dockerIgnoreTemplate,
  frontEndDockerfileTemplate,
} from "../../templates/docker";
import { nginxTemplate } from "../../templates/nginx";
import { commonPreset } from "../actions/commonPreset";

export async function init_browser_app(flags: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard config;
  const rearguardConfig = new RearguardConfig(CWD);

  // ! Set environment in which the code will work;
  await rearguardConfig.setRuntime("browser");

  // ! Set type of project;
  await rearguardConfig.setType("app");

  // ! Set buildAssets/Dockerfile;
  frontEndDockerfileTemplate.render(flags);

  // ! buildAssets/docker-compose.yml;
  dockerComposeExampleTemplate.render(flags);

  // ! buildAssets/nginx.conf;
  nginxTemplate.render(flags);

  // ! Create .dockerignore
  dockerIgnoreTemplate.render(flags);

  // ! Set scripts;
  // ! Create entry points: index.tsx, export.ts, vendors.ts;
  // ! Set configuration files: tsconfig.json, tests/tsconfig.json, .eslintrc, .gitignore;
  // ! Apply static templates to project;
  // ! Check/Install dependencies.
  await commonPreset(flags, CWD);
}
