import * as fs from "fs";
import * as path from "path";
import { ITemplate } from "../interfaces/templates/ITemplate";

export class Template implements ITemplate {
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

    this.sourceFilePath = path.resolve(path.dirname(sourceDir), this.sourceFileName);
    this.destinationFilePath = path.resolve(path.dirname(this.CWD), this.destinationFileName);

    this.sourceContent = "";

    if (fs.existsSync(this.sourceFilePath)) {
      this.sourceContent = fs.readFileSync(this.sourceFilePath, { encoding: "utf-8" });
    }
  }

  public render(templateData: { [key: string]: any }): void {
    if (fs.existsSync(this.CWD)) {
      fs.writeFileSync(this.destinationFilePath, this.sourceContent, { encoding: "utf-8" });
    }
  }

  public isExistDestFile(): boolean {
    return fs.existsSync(this.destinationFilePath);
  }
}
