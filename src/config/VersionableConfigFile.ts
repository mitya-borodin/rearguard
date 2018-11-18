import { isObject, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import defaultsDeep from "lodash.defaultsdeep";
import * as path from "path";

// tslint:disable:variable-name

export class VersionableConfigFile {
  private readonly config_path: string;
  private readonly default_config: object;

  constructor(file_name: string, default_config: object) {
    if (isString(file_name)) {
      this.config_path = path.resolve(process.cwd(), file_name);
    } else {
      throw new Error(`[ ${this.constructor.name} ][ file_name must be a string ]`);
    }

    if (isObject(default_config)) {
      this.default_config = default_config;
    } else {
      throw new Error(`[ ${this.constructor.name} ][ default_config must be a object ]`);
    }
  }

  public init(): { [key: string]: any } {
    if (fs.existsSync(this.config_path)) {
      const config = defaultsDeep(require(this.config_path), this.default_config);

      fs.writeFileSync(this.config_path, JSON.stringify(config, null, 2));

      return config;
    } else {
      fs.writeFileSync(this.config_path, JSON.stringify(this.default_config, null, 2));

      console.log(chalk.greenBright(`===========VESIONABLE-CONFIG-FILE==========`));
      console.log(chalk.greenBright(`[ CREATED ] ${this.config_path}`));
      console.log(chalk.greenBright(`===========================================`));
      console.log("");

      return this.default_config;
    }
  }

  public get config(): { [key: string]: any } {
    if (fs.existsSync(this.config_path)) {
      return require(this.config_path);
    } else {
      return this.init();
    }
  }
}

// tslint:enable:variable-name
