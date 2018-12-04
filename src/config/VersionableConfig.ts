import { isObject, isString, isUndefined } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as prettier_package_json from "prettier-package-json";
import { IVersionableConfig } from "../interfaces/config/IVersionableConfig";

// tslint:disable:variable-name

export class VersionableConfig implements IVersionableConfig {
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

        console.log(chalk.greenBright(`[ VERSIONABLE-CONFIG ][ CREATED ] FIELD 'rearguard' IN: ${this.config_path};`));
        console.log("");
      }
    } else {
      console.trace(
        chalk.bold.red(`[ ${this.constructor.name} ][ ERROR ][ You haven't package.json here: ${this.config_path} ]`),
      );

      process.exit(1);
    }
  }

  public get config(): { [key: string]: any } {
    return this.package_json.rearguard;
  }

  public set config(fields: { [key: string]: any }) {
    const { rearguard } = this.package_json;

    this.package_json.rearguard = { ...(isObject(rearguard) ? rearguard : {}), ...fields };

    const sorted_rearguard: { [key: string]: any } = {};

    for (const key of [
      "context",
      "entry",
      "dll_entry",
      "lib_entry",
      "modules",
      "output",
      "post_css_plugins_path",
      "sync_project_deps",
      "has_project",
      "has_dll",
      "has_node_lib",
      "has_ui_lib",
      "publish_in_git",
    ]) {
      sorted_rearguard[key] = this.package_json.rearguard[key];
    }

    const pkg = JSON.parse(prettier_package_json.format(this.package_json));

    pkg.rearguard = sorted_rearguard;

    fs.writeFileSync(this.config_path, JSON.stringify(pkg, null, 2));
  }

  public get pkg(): { [key: string]: any } {
    return this.package_json;
  }

  public set pkg(fields: { [key: string]: any }) {
    this.package_json = { ...this.package_json, ...fields };

    fs.writeFileSync(this.config_path, prettier_package_json.format(this.package_json));
  }
}

// tslint:enable:variable-name
