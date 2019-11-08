import * as fs from "fs";
import * as path from "path";
import { Template } from "../Template";
import { PACKAGE_JSON_FILE_NAME } from "../../const";
import { RearguardConfig } from "../../configs/RearguardConfig";

class VSCodeTemplate extends Template {
  public async render(
    templateData: { [key: string]: any } = { force: false },
    CWD: string = process.cwd(),
  ): Promise<void> {
    if (!this.isPartOfMonoRepository(path.resolve(CWD, ".."))) {
      await super.render(templateData, CWD);
    } else if (templateData.force) {
      fs.rmdirSync(path.resolve(CWD, ".vscode"), { recursive: true });
    }
  }

  private isPartOfMonoRepository(CWD: string, deep = 0): boolean {
    if (deep > 4) {
      return false;
    }

    if (fs.existsSync(path.resolve(CWD, PACKAGE_JSON_FILE_NAME))) {
      const rearguardConfig = new RearguardConfig(CWD);

      if (rearguardConfig.isMono()) {
        return true;
      }
    }

    return this.isPartOfMonoRepository(path.resolve(CWD, ".."), deep + 1);
  }
}

export const vsCodeSettingsTemplate = new VSCodeTemplate(
  "settings.json",
  ".vscode/settings.json",
  __dirname,
);

export const vsCodeExtensionsTemplate = new VSCodeTemplate(
  "extensions.json",
  ".vscode/extensions.json",
  __dirname,
);
