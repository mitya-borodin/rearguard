import { isObject, isString, isUndefined } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as prettier_package_json from "prettier-package-json";
import { IVersionableConfig } from "../interfaces/config/IVersionableConfig";

// tslint:disable:variable-name

export class VersionableConfig implements IVersionableConfig {
  private readonly config_path: string = path.resolve(process.cwd(), "package.json");

  constructor(config_path?: string) {
    if (isString(config_path)) {
      this.config_path = config_path;
    }
  }

  public get config(): { [key: string]: any } {
    return this.pkg.rearguard;
  }

  public set config(fields: { [key: string]: any }) {
    const cur_rearguard = this.pkg.rearguard;
    const unsorted_rearguard = { ...(isObject(cur_rearguard) ? cur_rearguard : {}), ...fields };
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
      sorted_rearguard[key] = unsorted_rearguard[key];
    }

    const pkg = JSON.parse(prettier_package_json.format(this.pkg));

    pkg.rearguard = sorted_rearguard;

    fs.writeFileSync(this.config_path, JSON.stringify(pkg, null, 2));
  }

  public get pkg(): { [key: string]: any } {
    if (fs.existsSync(this.config_path)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(this.config_path).toString());

        if (!pkg.rearguard) {
          this.pkg = { rearguard: {} };

          console.log(
            chalk.greenBright(`[ VERSIONABLE-CONFIG ][ CREATED ] FIELD 'rearguard' IN: ${this.config_path};`),
          );
          console.log("");

          return this.pkg;
        }

        return pkg;
      } catch (error) {
        console.error(error);

        return {};
      }
    } else {
      console.trace(
        chalk.bold.red(`[ ${this.constructor.name} ][ ERROR ][ You haven't package.json here: ${this.config_path} ]`),
      );

      process.exit(1);

      return {};
    }
  }

  public set pkg(fields: { [key: string]: any }) {
    fs.writeFileSync(this.config_path, prettier_package_json.format({ ...this.pkg, ...fields }));
  }
}

// tslint:enable:variable-name
