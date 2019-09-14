import * as ejs from "ejs";
import * as fs from "fs";
import { ITemplate } from "../../interfaces/templates/ITemplate";
import { Template } from "../Template";

export class GitignoreTemplate extends Template implements ITemplate {
  public render(templateData: { publish_to_git: boolean; list_for_load_on_demand: string }): void {
    if (fs.existsSync(this.CWD)) {
      const renderedContent: string = ejs.render(this.sourceContent, templateData);

      fs.writeFileSync(this.destinationFilePath, renderedContent, { encoding: "utf-8" });
    }
  }
}
