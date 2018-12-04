import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { NON_VERSIONABLE_CONFIG_FILE_NAME } from "../const";
import { IConfig } from "../interfaces/config/IConfig";

// tslint:disable:variable-name

export class NonVersionableConfig implements IConfig {
  private readonly config_path: string;
  private readonly origin: { [key: string]: any };

  constructor(file_name = NON_VERSIONABLE_CONFIG_FILE_NAME) {
    this.config_path = path.resolve(process.cwd(), file_name);
    this.origin = {};

    if (fs.existsSync(this.config_path)) {
      this.config = require(this.config_path);
    } else {
      this.config = {};

      console.log(chalk.greenBright(`[ NON-VERSIONABLE-CONFIG ][ CREATED ] ${this.config_path}`));
      console.log("");
    }
  }

  public get config(): { [key: string]: any } {
    return this.origin;
  }

  public set config(fields: { [key: string]: any }) {
    Object.assign(this.origin, { ...this.config, ...fields });

    fs.writeFileSync(this.config_path, JSON.stringify(this.origin, null, 2));
  }
}

// tslint:enable:variable-name
