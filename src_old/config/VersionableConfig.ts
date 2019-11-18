import { isObject, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as prettier_package_json from "prettier-package-json";
import { IVersionableConfig } from "../interfaces/config/IVersionableConfig";

// tslint:disable:variable-name

const field_order = [
  "context",
  "entry",
  "dll_entry",
  "lib_entry",
  "modules",
  "output",
  "post_css_plugins_path",
  "sync_project_deps",
  "is_application",
  "is_back_end",
  "has_dll",
  "has_browser_lib",
  "load_on_demand",
  "has_node_lib",
  "publish_in_git",
  "docker_org_name",
];

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
    const unsorted_rearguard = { ...this.pkg.rearguard, ...fields };
    const sorted_rearguard: { [key: string]: any } = {};

    for (const key of field_order) {
      if (unsorted_rearguard.hasOwnProperty(key)) {
        sorted_rearguard[key] = unsorted_rearguard[key];
      }
    }

    const pkg = JSON.parse(prettier_package_json.format(this.pkg).trim());

    pkg.rearguard = sorted_rearguard;

    fs.writeFileSync(this.config_path, JSON.stringify(pkg, null, 2).trim(), { encoding: "utf-8" });
  }

  public get pkg(): { [key: string]: any } {
    if (fs.existsSync(this.config_path)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(this.config_path).toString());

        if (!isObject(pkg.rearguard)) {
          this.pkg = { rearguard: {} };

          console.log(
            chalk.greenBright(
              `[ VERSIONABLE-CONFIG ][ CREATED ] FIELD 'rearguard' IN: ${this.config_path};`,
            ),
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
        chalk.bold.red(
          `[ ${this.constructor.name} ][ ERROR ][ You haven't package.json here: ${this.config_path} ]`,
        ),
      );

      process.exit(1);

      return {};
    }
  }

  public set pkg(fields: { [key: string]: any }) {
    if (fs.existsSync(this.config_path)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(this.config_path).toString());

        fs.writeFileSync(
          this.config_path,
          prettier_package_json.format({ ...pkg, ...fields }).trim(),
        );
      } catch (error) {
        console.error(error);

        process.exit(1);
      }
    } else {
      console.trace(
        chalk.bold.red(
          `[ ${this.constructor.name} ][ ERROR ][ You haven't package.json here: ${this.config_path} ]`,
        ),
      );

      process.exit(1);
    }
  }

  public order_config_fields() {
    this.config = this.config;
  }
}

// tslint:enable:variable-name
