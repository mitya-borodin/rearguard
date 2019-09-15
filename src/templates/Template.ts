import * as fs from "fs";
import * as path from "path";
import { mkdir } from "../helpers/mkdir";

// TODO Add logging;
export class Template {
  protected CWD: string;
  protected sourceFileName: string;
  protected sourceFilePath: string;
  protected sourceContent: string;
  protected destinationFileName: string;
  protected destinationFilePath: string;

  constructor(
    sourceFileName: string,
    destinationFileName: string,
    sourceDir: string = __dirname,
    CWD: string = process.cwd(),
  ) {
    this.CWD = CWD;

    this.sourceFileName = sourceFileName;
    this.destinationFileName = destinationFileName;

    this.sourceFilePath = path.resolve(sourceDir, this.sourceFileName);
    this.destinationFilePath = path.resolve(this.CWD, this.destinationFileName);

    this.sourceContent = "";

    if (fs.existsSync(this.sourceFilePath)) {
      this.sourceContent = fs.readFileSync(this.sourceFilePath, { encoding: "utf-8" });
    }
  }

  public async render(templateData: { [key: string]: any } = { force: false }): Promise<void> {
    await this.createTargetDir();

    if (fs.existsSync(this.CWD)) {
      if (this.isExistDestFile()) {
        if (templateData.force) {
          fs.writeFileSync(this.destinationFilePath, this.sourceContent, { encoding: "utf-8" });
        }
      } else {
        fs.writeFileSync(this.destinationFilePath, this.sourceContent, { encoding: "utf-8" });
      }
    }
  }

  public isExistDestFile(): boolean {
    return fs.existsSync(this.destinationFilePath);
  }

  public async createTargetDir(): Promise<void> {
    const targetDir: string = path.dirname(this.destinationFilePath);

    await mkdir(targetDir);
  }
}
