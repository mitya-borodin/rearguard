import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { configFileName as fileName } from "../../const";
import { IBuildConfig } from "../../interfaces/IConfigs";
import context from "../validate-config/context";
import css from "../validate-config/css";
import dll_entry from "../validate-config/dll_entry";
import entry from "../validate-config/entry";
import lib_entry from "../validate-config/lib_entry";
import modules from "../validate-config/modules";
import output from "../validate-config/output";
import proxy from "../validate-config/proxy";
import sync_npm_deps from "../validate-config/sync_npm_deps";
import typescript from "../validate-config/typescript";

export default (): IBuildConfig => {
  const configPath = path.resolve(process.cwd(), fileName);
  const config: IBuildConfig = {
    ...context(fileName),
    ...entry(fileName),
    ...lib_entry(fileName),
    ...dll_entry(fileName),
    ...modules(fileName),
    ...output(fileName),
    ...typescript(fileName),
    ...css(fileName),
    ...proxy(fileName),
    ...sync_npm_deps(fileName),
  };

  if (fs.existsSync(configPath)) {
    // Проверка на неиспользуемы поля в конфигурации.
    const CONFIG = require(configPath);

    for (const key in config) {
      if (CONFIG.hasOwnProperty(key)) {
        delete CONFIG[key];
      }
    }

    if (Object.keys(CONFIG).length > 0) {
      console.log(chalk.redBright(`===REARGUARD_BUILD_CONFIG_HAS_ERROR====`));
      console.log(chalk.red(`PATH_TO_CONFIG: ${configPath};`));
      console.log(chalk.red(`This is params is not used:`));
      console.log(chalk.red(JSON.stringify(CONFIG, null, 2)));
      console.log(chalk.red(`Please remove their from ${fileName};`));
      console.log(chalk.redBright(`=======================================`));
      console.log("");
    }
  } else {
    // Создание конфигурационного файла если он не существует.
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(chalk.greenBright(`==REARGUARD_BUILD_CONFIG_WAS_CREATED==`));
    console.log(chalk.greenBright(`Was created ${fileName};`));
    console.log(chalk.greenBright(`PATH_TO_CONFIG: ${configPath};`));
    console.log(chalk.greenBright(`======================================`));
    console.log("");
  }

  return config;
};
