import { isObject, isString, isUndefined } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as prettier_package_json from "prettier-package-json";

// tslint:disable:variable-name

export class VersionableConfig {
  private package_json: { [key: string]: any };
  private readonly config_path: string = path.resolve(process.cwd(), "package.json");

  constructor(config_path?: string) {
    if (isString(config_path)) {
      this.config_path = config_path;
    }

    this.package_json = { rearguard: {} };

    if (fs.existsSync(this.config_path)) {
      this.package_json = require(this.config_path);

      if (isUndefined(this.package_json.rearguard)) {
        this.config = {};

        console.log(chalk.greenBright(`===========VESIONABLE-CONFIG==========`));
        console.log(chalk.greenBright(`CREATED FIELD 'rearguard' IN: ${this.config_path};`));
        console.log(chalk.greenBright(`======================================`));
        console.log("");
      }
    } else {
      console.log(chalk.bold.red(`[ CONFIG ][ ERROR ][ You haven't package.json here: ${this.config_path} ]`));

      process.exit(1);
    }
  }

  public get config(): { [key: string]: any } {
    return this.package_json.rearguard;
  }

  public set config(fields: { [key: string]: any }) {
    const rearguard = this.package_json.rearguard;

    this.package_json.rearguard = { ...(isObject(rearguard) ? rearguard : {}), ...fields };

    fs.writeFileSync(this.config_path, prettier_package_json.format(this.package_json));
  }

  protected get pkg(): { [key: string]: any } {
    return this.package_json;
  }

  protected set pkg(fields: { [key: string]: any }) {
    this.package_json = { ...this.package_json, ...fields };

    fs.writeFileSync(this.config_path, prettier_package_json.format(this.package_json));
  }
}

// tslint:enable:variable-name
