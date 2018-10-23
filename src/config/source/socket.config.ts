import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { ISocket } from "../../interfaces/IConfigs";
import socket, { defaultValue } from "../validate-config/socket";

export default (fileName = "socket.config.json"): ISocket => {
  const CWD = process.cwd();
  const configPath = path.resolve(CWD, fileName);

  if (fs.existsSync(configPath)) {
    return socket(
      JSON.parse(fs.readFileSync(configPath, { encoding: "utf8" })),
    );
  } else {
    console.log(chalk.greenBright(`==REARGUARD_SOCKET_CONFIG_WAS_CREATED==`));
    console.log(chalk.greenBright(`Was created ${fileName};`));
    console.log(chalk.greenBright(`PATH_TO_CONFIG: ${configPath};`));
    console.log(chalk.greenBright(`=======================================`));
    console.log("");

    fs.writeFileSync(configPath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
};
