import { ITemplate } from "../../interfaces/templates/ITemplate";
import { Template } from "../Template";

export const nginxTemplate: ITemplate = new Template("nginx.conf", "buildAssets/nginx.conf");
