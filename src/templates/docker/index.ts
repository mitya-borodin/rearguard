import { ITemplate } from "../../interfaces/templates/ITemplate";
import { Template } from "../Template";

export const dockerIgnoreTemplate: ITemplate = new Template(".dockerignore", ".dockerignore");
export const backEndDockerfileTemplate: ITemplate = new Template("back_end.Dockerfile", "buildAssets/Dockerfile");
export const frontEndDockerfileTemplate: ITemplate = new Template("front_end.Dockerfile", "buildAssets/Dockerfile");
export const dockerComposeExampleTemplate: ITemplate = new Template(
  "docker-compose.yml",
  "buildAssets/docker-compose.yml",
);
