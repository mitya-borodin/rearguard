import { isObject } from "@borodindmitriy/utils";
import chalk from "chalk";
import { NonVersionableConfig } from "../NonVersionableConfig";

export class ProxyConfig extends NonVersionableConfig {
  get map(): { [key: string]: any } {
    if (isObject(this.config.proxy)) {
      return this.config.proxy;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ PROXY_CONFIG ][ WARNING ][ proxy ][ MUST_BE_DEFINED ]`));

    this.config = {
      proxy: {
        "/service": "http://localhost:10000",
        "/ws": {
          changeOrigin: true,
          target: "ws://localhost:10001",
          ws: true,
        },
      },
    };

    console.log(chalk.bold.green(`[ PROXY_CONFIG ][ WAS_UPDATED ]`));
    console.log(chalk.green(JSON.stringify(this.config, null, 2)));

    return this.map;
  }
}
