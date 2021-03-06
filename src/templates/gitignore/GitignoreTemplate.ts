import ejs from "ejs";
import fs from "fs";
import { Template } from "../Template";

// TODO Add logging;
export class GitignoreTemplate extends Template {
  public async render(templateData: {
    publish_to_git: boolean;
    listOfModulesWhichLoadOnDemand: string;
    force: boolean;
  }): Promise<void> {
    await this.createTargetDir();

    if (this.isExistCWD) {
      const renderedContent: string = ejs.render(this.sourceContent, templateData);

      if (this.isExistDestFile) {
        if (templateData.force) {
          fs.writeFileSync(this.destinationFilePath, renderedContent, { encoding: "utf-8" });
        }
      } else {
        fs.writeFileSync(this.destinationFilePath, renderedContent, { encoding: "utf-8" });
      }
    }
  }
}
