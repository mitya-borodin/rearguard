import * as ejs from "ejs";
import * as fs from "fs";
import { ITemplate } from "../../interfaces/templates/ITemplate";
import { Template } from "../Template";

export class GitignoreTemplate extends Template implements ITemplate {
  public async render(templateData: {
    publish_to_git: boolean;
    list_for_load_on_demand: string;
    force: boolean;
  }): Promise<void> {
    if (fs.existsSync(this.CWD)) {
      const renderedContent: string = ejs.render(this.sourceContent, templateData);

      if (this.isExistDestFile()) {
        if (templateData.force) {
          fs.writeFileSync(this.destinationFilePath, renderedContent, { encoding: "utf-8" });
        }
      } else {
        fs.writeFileSync(this.destinationFilePath, renderedContent, { encoding: "utf-8" });
      }
    }
  }
}
