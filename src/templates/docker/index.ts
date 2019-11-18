import { Template } from "../Template";
import { BUILD_ASSETS_DIR_NAME } from "../../const";

export const dockerIgnoreTemplate = new Template(".dockerignore", ".dockerignore", __dirname);
export const backEndDockerfileTemplate = new Template(
  "back_end.Dockerfile",
  `${BUILD_ASSETS_DIR_NAME}/Dockerfile`,
  __dirname,
);
export const frontEndDockerfileTemplate = new Template(
  "front_end.Dockerfile",
  `${BUILD_ASSETS_DIR_NAME}/Dockerfile`,
  __dirname,
);
export const dockerComposeExampleTemplate = new Template(
  "docker-compose.yml",
  `${BUILD_ASSETS_DIR_NAME}/docker-compose.yml`,
  __dirname,
);
