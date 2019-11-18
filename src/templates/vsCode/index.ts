import fs from "fs";
import path from "path";
import { Template } from "../Template";
import { PACKAGE_JSON_FILE_NAME } from "../../const";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { promisify } from "util";

const rmdir = promisify(fs.rmdir);
const exists = promisify(fs.exists);

class VSCodeTemplate extends Template {
  public async render(
    templateData: { [key: string]: any } = { force: false },
    CWD: string = process.cwd(),
  ): Promise<void> {
    if (!(await this.isPartOfMonoRepository(path.resolve(CWD, "..")))) {
      await super.render(templateData, CWD);
    } else if (templateData.force) {
      await rmdir(path.resolve(CWD, ".vscode"), { recursive: true });
    }
  }

  private async isPartOfMonoRepository(CWD: string, deep = 0): Promise<boolean> {
    if (deep > 4) {
      return false;
    }

    if (await exists(path.resolve(CWD, PACKAGE_JSON_FILE_NAME))) {
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
