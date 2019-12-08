import { isObject, isString } from "@rtcts/utils";
import chalk from "chalk";
import * as fs from "fs";
import { defaultsDeep } from "lodash";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { IConfigFile } from "../interfaces/config/IConfigFile";
import { envConfig } from "./env";

// tslint:disable:variable-name

export class ConfigFile implements IConfigFile {
  public readonly config_path: string;

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
        return JSON.parse(fs.readFileSync(this.config_path).toString());
      } catch (error) {
        console.error(error);

        return this.init();
      }
    } else {
      return this.init();
    }
  }

  public init(force = false): { [key: string]: any } {
    if (fs.existsSync(this.config_path)) {
      try {
        if (!envConfig.force && !force) {
          const config_from_file = fs.readFileSync(this.config_path);
          const source_config = JSON.parse(config_from_file.toString());

          if (isObject(source_config)) {
            const config = defaultsDeep(source_config, this.default_config);

            fs.writeFileSync(this.config_path, JSON.stringify(config, null, 2).trim());

            return config;
          }

          fs.writeFileSync(this.config_path, JSON.stringify(this.default_config, null, 2).trim());

          return this.default_config;
        } else {
          fs.writeFileSync(this.config_path, JSON.stringify(this.default_config, null, 2).trim());

          console.log(chalk.yellow(`[ CONFIG_FILE ][ FORCE_INIT ][ ${this.config_path} ]`));

          return this.default_config;
        }
      } catch (error) {
        console.error("[ CONFIG_FILE ][ INIT ][ ERROR ]");
        console.error(error);

        fs.unlinkSync(this.config_path);

        console.log(chalk.gray(`[ CONFIG_FILE ][ DELETE ] ${this.config_path}`));

        return this.init();
      }
    } else {
      mkdirp.sync(path.dirname(this.config_path));

      fs.writeFileSync(this.config_path, JSON.stringify(this.default_config, null, 2).trim());

      console.log(chalk.greenBright(`[ CONFIG_FILE ][ CREATE ] ${this.config_path}`));

      return this.default_config;
    }
  }

  protected get default_config(): { [key: string]: any } {
    return {};
  }
}

// tslint:enable:variable-name
