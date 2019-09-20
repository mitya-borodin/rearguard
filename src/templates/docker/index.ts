import { Template } from "../Template";

export const dockerIgnoreTemplate = new Template(".dockerignore", ".dockerignore", __dirname);
export const backEndDockerfileTemplate = new Template(
  "back_end.Dockerfile",
  "buildAssets/Dockerfile",
  __dirname,
);
export const frontEndDockerfileTemplate = new Template(
  "front_end.Dockerfile",
  "buildAssets/Dockerfile",
  __dirname,
);
export const dockerComposeExampleTemplate = new Template(
  "docker-compose.yml",
  "buildAssets/docker-compose.yml",
  __dirname,
);
