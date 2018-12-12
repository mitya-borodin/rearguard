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
    if (isString(config_path) && fs.existsSync(config_path)) {
      this.config_path = config_path;
    }
  }

  public get config(): { [key: string]: any } {
    if (fs.existsSync(this.config_path)) {
      try {
        return JSON.parse(fs.readFileSync(this.config_path).toString());
      } catch (error) {
        console.error(error);

        process.exit(0);

        return {};
      }
    } else {
      fs.writeFileSync(this.config_path, JSON.stringify({}, null, 2));

      console.log(chalk.greenBright(`[ NON-VERSIONABLE-CONFIG ][ CREATED ][ ${this.config_path} ]`));
      console.log("");

      return this.config;
    }
  }

  public set config(fields: { [key: string]: any }) {
    fs.writeFileSync(this.config_path, JSON.stringify({ ...this.config, ...fields }, null, 2));
  }
}

// tslint:enable:variable-name
