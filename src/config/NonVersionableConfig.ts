import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { NON_VERSIONABLE_CONFIG_FILE_NAME } from "../const";

// tslint:disable:variable-name

export class NonVersionableConfig {
  public get fileName(): string {
    return NON_VERSIONABLE_CONFIG_FILE_NAME;
  }

  public get config(): { [key: string]: any } {
    if (fs.existsSync(this.config_path)) {
      return require(this.config_path);
    }

    console.log(chalk.bold.red(`[ CONFIG ][ ERROR ][ You haven't config here: ${this.config_path} ]`));

    return {};
  }

  public set config(config: { [key: string]: any }) {
    fs.writeFileSync(this.config_path, JSON.stringify({ ...this.config, ...config }, null, 2));
  }

  private readonly config_path: string = path.resolve(process.cwd(), NON_VERSIONABLE_CONFIG_FILE_NAME);

  constructor() {
    if (!fs.existsSync(this.config_path)) {
      this.config = {};

      console.log(chalk.greenBright(`=========NON-VESIONABLE-CONFIG========`));
      console.log(chalk.greenBright(`CREATED: ${this.config_path};`));
      console.log(chalk.greenBright(`======================================`));
      console.log("");
    }
  }
}

// tslint:enable:variable-name
