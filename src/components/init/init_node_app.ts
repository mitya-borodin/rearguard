import { RearguardConfig } from "../../configs/RearguardConfig";
import { RearguardDevConfig } from "../../configs/RearguardDevConfig";
import {
  backEndDockerfileTemplate,
  dockerComposeExampleTemplate,
  dockerIgnoreTemplate,
} from "../../templates/docker";
import { commonPreset } from "../procedures/commonPreset";
import { initPackage } from "../procedures/initPackage";

export async function init_node_app(flags: { force: boolean }): Promise<void> {
  const CWD: string = process.cwd();

  await initPackage(CWD);

  // * Create rearguard config;
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardDevConfig(CWD);

  // ! Set status.
  await rearguardLocalConfig.setBuildStatus("init");

  // ! Set environment in which the code will work
  await rearguardConfig.setRuntime("node");

  // ! Set type of project
  await rearguardConfig.setType("app");

  // ! Set path to bin file
  await rearguardConfig.setBin("./bin/index.ts");

  // ! Set buildAssets/Dockerfile
  await backEndDockerfileTemplate.render(flags);

  // ! buildAssets/docker-compose.yml
  await dockerComposeExampleTemplate.render(flags);

  // ! Create .dockerignore
  await dockerIgnoreTemplate.render(flags);

  // ! Set scripts
  // ! Create entry points: index.tsx, export.ts, vendors.ts
  // ! Set configuration files: tsconfig.json, tests/tsconfig.json, .eslintrc, .gitignore
  // ! Apply static templates to project
  // ! Check/Install dependencies
  // ! Set dll entry name which depend on pkg.name
  await commonPreset(flags, CWD);
}
