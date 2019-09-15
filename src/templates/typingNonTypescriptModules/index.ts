import { ITemplate } from "../../interfaces/templates/ITemplate";
import { Template } from "../Template";

export const typingNonTypescriptModulesTemplate: ITemplate = new Template(
  "typings.d.ts",
  "src/typings.d.ts",
  __dirname,
);
