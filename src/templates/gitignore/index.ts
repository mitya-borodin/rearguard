import { ITemplate } from "../../interfaces/templates/ITemplate";
import { Template } from "../Template";
import { GitignoreTemplate } from "./GitignoreTemplate";

export const gitignore: ITemplate = new GitignoreTemplate(".gitignore", ".gitignore");
