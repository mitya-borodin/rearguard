import { ES_LINT_CONFIG_FILE_NAME, ES_LINT_IGNORE_FILE_NAME } from "../../const";
import { Template } from "../Template";

export const nodeLibLintTemplate = new Template(
  `node_lib${ES_LINT_CONFIG_FILE_NAME}`,
  ES_LINT_CONFIG_FILE_NAME,
  __dirname,
);
export const browserOrIsomorphicLintTemplate = new Template(
  `browser_isomorphic${ES_LINT_CONFIG_FILE_NAME}`,
  ES_LINT_CONFIG_FILE_NAME,
  __dirname,
);
export const lintIgnoreTemplate = new Template(
  ES_LINT_IGNORE_FILE_NAME,
  ES_LINT_IGNORE_FILE_NAME,
  __dirname,
);
