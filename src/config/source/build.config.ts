import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { IBuildConfig } from "../../interfaces/IConfigs";
import browserslist from "../validate-config/browserslist";
import context from "../validate-config/context";
import css from "../validate-config/css";
import entry from "../validate-config/entry";
import isomorphic from "../validate-config/isomorphic";
import modules from "../validate-config/modules";
import output from "../validate-config/output";
import proxy from "../validate-config/proxy";
import typescript from "../validate-config/typescript";

export default (): IBuildConfig => {
  const fileName = "build.config.json";
  const configPath = path.resolve(process.cwd(), fileName);

  const config: IBuildConfig = {
    ...browserslist(fileName),
    ...context(fileName),
    ...css(fileName),
    ...entry(fileName),
    ...isomorphic(fileName),
    ...modules(fileName),
    ...output(fileName),
    ...proxy(fileName),
    ...typescript(fileName),
  };

  if (fs.existsSync(configPath)) {
    const CONFIG = require(configPath);

    for (const key in config) {
      if (CONFIG.hasOwnProperty(key)) {
        delete CONFIG[key];
      }
    }

    if (Object.keys(CONFIG).length > 0) {
      console.log(chalk.bold.red(`This is configs not used: \n\r"${JSON.stringify(CONFIG, null, 2)}"`));
      console.log(chalk.bold.red("Please remove their from build.config.json"));
    }
  } else {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }

  return config;
};
