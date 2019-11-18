import { LINT_CONFIG_FILE_NAME, LINT_IGNORE_FILE_NAME } from "../../const";
import { Template } from "../Template";

export const nodeLibLintTemplate = new Template(
  `node_lib${LINT_CONFIG_FILE_NAME}`,
  LINT_CONFIG_FILE_NAME,
  __dirname,
);
export const browserOrIsomorphicLintTemplate = new Template(
  `browser_isomorphic${LINT_CONFIG_FILE_NAME}`,
  LINT_CONFIG_FILE_NAME,
  __dirname,
);
export const lintIgnoreTemplate = new Template(
  LINT_IGNORE_FILE_NAME,
  LINT_IGNORE_FILE_NAME,
  __dirname,
);
