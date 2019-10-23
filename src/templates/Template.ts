import * as fs from "fs";
import * as path from "path";
import { mkdir } from "../helpers/mkdir";

// TODO Add logging;
export class Template {
  protected CWD: string;
  protected sourceDir: string;
  protected sourceFileName: string;
  protected destinationFileName: string;

  constructor(
    sourceFileName: string,
    destinationFileName: string,
    sourceDir: string = __dirname,
    CWD: string = process.cwd(),
  ) {
    this.CWD = CWD;
    this.sourceDir = sourceDir;

    this.sourceFileName = sourceFileName;
    this.destinationFileName = destinationFileName;
  }

  protected get sourceFilePath(): string {
    return path.resolve(this.sourceDir, this.sourceFileName);
  }

  protected get destinationFilePath(): string {
    return path.resolve(this.CWD, this.destinationFileName);
  }

  protected get sourceContent(): string {
    return fs.readFileSync(this.sourceFilePath, { encoding: "utf-8" });
  }

  protected get isExistCWD(): boolean {
    return fs.existsSync(this.CWD);
  }

  protected get isExistDestFile(): boolean {
    return fs.existsSync(this.destinationFilePath);
  }

  public async render(
    templateData: { [key: string]: any } = { force: false },
    CWD: string = process.cwd(),
  ): Promise<void> {
    this.CWD = CWD;

    await this.createTargetDir();

    if (this.isExistDestFile) {
      if (templateData.force) {
        fs.writeFileSync(this.destinationFilePath, this.sourceContent, { encoding: "utf-8" });
      }
    } else {
      fs.writeFileSync(this.destinationFilePath, this.sourceContent, { encoding: "utf-8" });
    }
  }

  public async createTargetDir(): Promise<void> {
    mkdir(path.dirname(this.destinationFilePath));
  }
}
