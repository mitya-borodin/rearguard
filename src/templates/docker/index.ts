import { ITemplate } from "../../interfaces/templates/ITemplate";
import { Template } from "../Template";

export const dockerIgnore: ITemplate = new Template(".dockerignore", ".dockerignore");
export const backEndDockerfile: ITemplate = new Template("back_end.Dockerfile", "buildAssets/Dockerfile");
export const frontEndDockerfile: ITemplate = new Template("front_end.Dockerfile", "buildAssets/Dockerfile");
export const dockerComposeExample: ITemplate = new Template("docker-compose.yml", "buildAssets/docker-compose.yml");
