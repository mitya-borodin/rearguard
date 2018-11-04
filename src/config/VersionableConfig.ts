import { isUndefined } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as prettier_package_json from "prettier-package-json";

// tslint:disable:variable-name

export class VersionableConfig {
  public get fileName(): string {
    return "package.json";
  }

  public get config(): { [key: string]: any } {
    return this.pkg.rearguard;
  }

  public set config(rearguard: { [key: string]: any }) {
    this.pkg.rearguard = { ...this.pkg.rearguard, ...rearguard };

    fs.writeFileSync(this.config_path, prettier_package_json.format(this.pkg));
  }
  protected readonly pkg: { [key: string]: any } = { rearguard: {} };
  private readonly config_path: string = path.resolve(process.cwd(), "package.json");

  constructor() {
    if (fs.existsSync(this.config_path)) {
      this.pkg = require(this.config_path);

      if (isUndefined(this.pkg.rearguard)) {
        this.config = {};

        console.log(chalk.greenBright(`===========VESIONABLE-CONFIG==========`));
        console.log(chalk.greenBright(`CREATED: ${this.config_path};`));
        console.log(chalk.greenBright(`======================================`));
        console.log("");
      }
    } else {
      console.log(chalk.bold.red(`[ CONFIG ][ ERROR ][ You haven't package.json here: ${this.config_path} ]`));

      process.exit(1);
    }
  }
}

// tslint:enable:variable-name
