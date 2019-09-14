import { ITemplate } from "../../interfaces/templates/ITemplate";
import { GitignoreTemplate } from "./GitignoreTemplate";

export const gitignoreTemplate: ITemplate = new GitignoreTemplate(".gitignore", ".gitignore");
