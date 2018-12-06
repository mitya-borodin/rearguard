import { isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { NON_VERSIONABLE_CONFIG_FILE_NAME } from "../const";
import { IConfig } from "../interfaces/config/IConfig";

// tslint:disable:variable-name

export class NonVersionableConfig implements IConfig {
  private readonly config_path: string = path.resolve(process.cwd(), NON_VERSIONABLE_CONFIG_FILE_NAME);

  constructor(config_path?: string) {
    if (isString(config_path)) {
      if (fs.existsSync(config_path)) {
        this.config_path = config_path;
      } else {
        console.trace(
          chalk.bold.red(
            `[ ${this.constructor.name} ][ ERROR ][ You haven't non versionable config ${this.config_path} here: ${
              this.config_path
            } ]`,
          ),
        );

        process.exit(1);
      }
    }
  }

  public get config(): { [key: string]: any } {
    if (fs.existsSync(this.config_path)) {
      try {
        return JSON.parse(fs.readFileSync(this.config_path).toString());
      } catch (error) {
        console.error(error);

        return {};
      }
    }

    console.trace(
      chalk.bold.red(
        `[ ${this.constructor.name} ][ ERROR ][ You haven't non versionable config here: ${this.config_path} ]`,
      ),
    );

    process.exit(1);

    return {};
  }

  public set config(fields: { [key: string]: any }) {
    fs.writeFileSync(this.config_path, JSON.stringify({ ...this.config, ...fields }, null, 2));
  }
}

// tslint:enable:variable-name
