import { isObject, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import defaultsDeep from "lodash.defaultsdeep";
import * as path from "path";
import { IConfigFile } from "../interfaces/IConfigFile";

// tslint:disable:variable-name

export class ConfigFile implements IConfigFile {
  private readonly config_path: string;

  constructor(file_name: string) {
    if (isString(file_name)) {
      this.config_path = path.resolve(process.cwd(), file_name);
    } else {
      throw new Error(`[ ${this.constructor.name} ][ file_name must be a string ]`);
    }
  }

  public get config(): { [key: string]: any } {
    if (fs.existsSync(this.config_path)) {
      try {
        const config_from_file = require(this.config_path);

        if (isObject(config_from_file)) {
          return config_from_file;
        }

        return this.init();
      } catch (error) {
        console.error(error);

        return this.init();
      }
    } else {
      return this.init();
    }
  }

  public init(): { [key: string]: any } {
    if (fs.existsSync(this.config_path)) {
      try {
        const config_from_file = require(this.config_path);

        if (isObject(config_from_file)) {
          const config = defaultsDeep(config_from_file, this.default_config);

          fs.writeFileSync(this.config_path, JSON.stringify(config, null, 2));

          return config;
        }

        fs.writeFileSync(this.config_path, JSON.stringify(this.default_config, null, 2));

        return this.default_config;
      } catch (error) {
        console.error(error);

        fs.unlinkSync(this.config_path);

        console.log(chalk.gray(`===========CONFIG-FILE==========`));
        console.log(chalk.gray(`[ DELETE ] ${this.config_path}`));
        console.log(chalk.gray(`================================`));
        console.log("");

        return this.init();
      }
    } else {
      fs.writeFileSync(this.config_path, JSON.stringify(this.default_config, null, 2));

      console.log(chalk.greenBright(`===========CONFIG-FILE==========`));
      console.log(chalk.greenBright(`[ CREATE ] ${this.config_path}`));
      console.log(chalk.greenBright(`================================`));
      console.log("");

      return this.default_config;
    }
  }

  protected get default_config(): { [key: string]: any } {
    return {};
  }
}

// tslint:enable:variable-name
