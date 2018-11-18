import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { NON_VERSIONABLE_CONFIG_FILE_NAME } from "../const";
import { INonVersionableConfig } from "../interfaces/INonVersionableConfig";

// tslint:disable:variable-name

export class NonVersionableConfig implements INonVersionableConfig {
  private readonly config_path: string = path.resolve(process.cwd(), NON_VERSIONABLE_CONFIG_FILE_NAME);
  private readonly origin: { [key: string]: any };

  constructor() {
    this.origin = {};

    if (fs.existsSync(this.config_path)) {
      this.config = require(this.config_path);
    } else {
      this.config = {};

      console.log(chalk.greenBright(`=========NON-VESIONABLE-CONFIG========`));
      console.log(chalk.greenBright(`CREATED: ${this.config_path};`));
      console.log(chalk.greenBright(`======================================`));
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
